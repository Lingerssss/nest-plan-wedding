import { NextRequest, NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { createWedding, listUserWeddings } from '@/lib/server/services/wedding-service'

// GET /api/weddings - 获取用户参与的所有婚礼
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthContext(request)
    const weddings = await listUserWeddings(auth.user.id)

    return NextResponse.json({ weddings })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// POST /api/weddings - 创建新婚礼
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthContext(request)
    const body = await request.json()
    const wedding = await createWedding(auth.user.id, body)

    return NextResponse.json({ wedding }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
