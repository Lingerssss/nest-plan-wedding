import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/server/errors/app-error'
import type {
  AuthContext,
  AuthSuccessResult,
  LoginWithPasswordInput,
  RegisterWithPasswordInput,
} from '@/types/auth'
import {
  clearSessionCookie,
  createSession,
  deleteSessionByToken,
  setSessionCookie,
  toAuthUserDto,
} from '../auth/session'

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

function validatePasswordPayload(username: string, password: string) {
  if (!username || !password) {
    throw new ValidationError('Username and password are required')
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long')
  }
}

export async function registerWithPassword(
  input: RegisterWithPasswordInput
): Promise<AuthSuccessResult> {
  const { username, password, email, displayName, clientType = 'WEB' } = input

  validatePasswordPayload(username, password)

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        ...(email ? [{ email }] : []),
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  })

  if (existingUser?.username === username) {
    throw new ConflictError('Username already exists')
  }

  if (existingUser?.email && email && existingUser.email === email) {
    throw new ConflictError('Email already exists')
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      username,
      email: email || null,
      displayName: displayName || username,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      phone: true,
    },
  })

  const session = await createSession(user.id, clientType)
  if (clientType === 'WEB') {
    await setSessionCookie(session.token, session.expiresAt)
  }

  return {
    user: toAuthUserDto(user),
    accessToken: session.token,
    expiresAt: session.expiresAt,
  }
}

export async function loginWithPassword(
  input: LoginWithPasswordInput
): Promise<AuthSuccessResult> {
  const { username, password, clientType = 'WEB' } = input

  validatePasswordPayload(username, password)

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      phone: true,
      passwordHash: true,
    },
  })

  if (!user) {
    throw new UnauthorizedError('Invalid username or password')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw new UnauthorizedError('Invalid username or password')
  }

  const session = await createSession(user.id, clientType)
  if (clientType === 'WEB') {
    await setSessionCookie(session.token, session.expiresAt)
  }

  return {
    user: toAuthUserDto(user),
    accessToken: session.token,
    expiresAt: session.expiresAt,
  }
}

export async function getCurrentUserProfile(auth: AuthContext) {
  return auth.user
}

export async function logout(auth: AuthContext | null) {
  if (auth?.token) {
    await deleteSessionByToken(auth.token)
  }

  await clearSessionCookie()
}
