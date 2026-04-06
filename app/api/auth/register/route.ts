import { NextRequest, NextResponse } from 'next/server'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { registerWithPassword } from '@/lib/server/services/auth-service'
import type { AuthClientType } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clientType = (body.clientType || 'WEB') as AuthClientType
    const result = await registerWithPassword({
      username: body.username,
      password: body.password,
      email: body.email,
      displayName: body.displayName,
      clientType,
    })

    return NextResponse.json(
      result,
      { status: 201 }
    )
  } catch (error) {
    return toErrorResponse(error)
  }
}
