import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import type { AuthClientType, AuthUserDto, SessionResult } from '@/types/auth'

export const SESSION_COOKIE_NAME = 'wedding-tracker-session'
export const SESSION_MAX_AGE =
  Number(process.env.SESSION_MAX_AGE_DAYS || '7') * 24 * 60 * 60

export function toAuthUserDto(user: {
  id: string
  username: string
  displayName: string | null
  email: string | null
  phone: string | null
}) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
  } satisfies AuthUserDto
}

export async function cleanupExpiredSessions() {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

export async function createSession(
  userId: string,
  clientType: AuthClientType = 'WEB'
): Promise<SessionResult> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await prisma.session.create({
    data: {
      userId,
      token,
      clientType,
      expiresAt,
      lastAccessAt: new Date(),
    },
  })

  return { token, expiresAt }
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function deleteSessionByToken(token: string) {
  await prisma.session.deleteMany({
    where: { token },
  })
}

export async function getSessionByToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  if (session.expiresAt < new Date()) {
    await deleteSessionByToken(token)
    return null
  }

  return session
}
