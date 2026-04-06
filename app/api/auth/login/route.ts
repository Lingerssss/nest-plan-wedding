import { NextRequest, NextResponse } from 'next/server'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { loginWithPassword } from '@/lib/server/services/auth-service'
import type { AuthClientType } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clientType = (body.clientType || 'WEB') as AuthClientType
    const result = await loginWithPassword({
      username: body.username,
      password: body.password,
      clientType,
    })

    return NextResponse.json(result)
  } catch (error) {
    return toErrorResponse(error)
  }
}
