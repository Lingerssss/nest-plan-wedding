import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { AuthClientType } from '@/types/auth'
import {
  clearSessionCookie,
  createSession as createSessionRecord,
  deleteSessionByToken,
  getSessionByToken,
  SESSION_COOKIE_NAME,
  toAuthUserDto,
} from './server/auth/session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(
  userId: string,
  clientType: AuthClientType = 'WEB'
): Promise<string> {
  const session = await createSessionRecord(userId, clientType)

  if (clientType === 'WEB') {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)),
      path: '/',
      expires: session.expiresAt,
    })
  }

  return session.token
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) return null
  
  const session = await getSessionByToken(token)
  if (!session) {
    return null
  }

  return toAuthUserDto(session.user)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (token) {
    await deleteSessionByToken(token)
  }
  
  await clearSessionCookie()
}
