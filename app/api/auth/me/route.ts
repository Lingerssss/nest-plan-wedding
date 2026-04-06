import { NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { getCurrentUserProfile } from '@/lib/server/services/auth-service'

export async function GET(request: Request) {
  try {
    const auth = await requireAuthContext(request)
    const user = await getCurrentUserProfile(auth)

    return NextResponse.json({ user })
  } catch (error) {
    return toErrorResponse(error)
  }
}
