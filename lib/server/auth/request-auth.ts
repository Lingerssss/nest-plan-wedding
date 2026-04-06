import type { NextRequest } from 'next/server'
import { UnauthorizedError } from '@/lib/server/errors/app-error'
import type { AuthContext } from '@/types/auth'
import { getSessionByToken, SESSION_COOKIE_NAME, toAuthUserDto } from './session'

function getCookieHeader(request: Request | NextRequest) {
  return request.headers.get('cookie') || ''
}

function getCookieValue(cookieHeader: string, cookieName: string) {
  const cookies = cookieHeader.split(';').map((item) => item.trim())
  const target = cookies.find((item) => item.startsWith(`${cookieName}=`))
  return target ? decodeURIComponent(target.slice(cookieName.length + 1)) : null
}

export function extractBearerToken(request: Request | NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length).trim() || null
}

export async function resolveAuthContext(
  request: Request | NextRequest
): Promise<AuthContext | null> {
  const bearerToken = extractBearerToken(request)
  const cookieToken = getCookieValue(getCookieHeader(request), SESSION_COOKIE_NAME)
  const token = bearerToken || cookieToken

  if (!token) {
    return null
  }

  const session = await getSessionByToken(token)
  if (!session) {
    return null
  }

  return {
    user: toAuthUserDto(session.user),
    token: session.token,
    sessionId: session.id,
    clientType: session.clientType as AuthContext['clientType'],
    expiresAt: session.expiresAt,
  }
}

export async function requireAuthContext(request: Request | NextRequest) {
  const auth = await resolveAuthContext(request)
  if (!auth) {
    throw new UnauthorizedError('Unauthorized')
  }

  return auth
}
