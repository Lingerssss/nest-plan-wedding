import { NextRequest, NextResponse } from 'next/server'
import { resolveAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { logout } from '@/lib/server/services/auth-service'

export async function POST(request: NextRequest) {
  try {
    const auth = await resolveAuthContext(request)
    await logout(auth)
    return NextResponse.json({ success: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}
