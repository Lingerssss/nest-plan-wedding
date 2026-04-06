import { NextRequest, NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import {
  deleteWedding,
  getWeddingDetail,
  updateWedding,
} from '@/lib/server/services/wedding-service'

// GET /api/weddings/[id] - 获取婚礼详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requireAuthContext(request)
    const wedding = await getWeddingDetail(auth.user.id, id)

    return NextResponse.json({ wedding })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// PUT /api/weddings/[id] - 更新婚礼（仅OWNER）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requireAuthContext(request)
    const body = await request.json()
    const wedding = await updateWedding(auth.user.id, id, body)

    return NextResponse.json({ wedding })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// DELETE /api/weddings/[id] - 删除婚礼（仅OWNER）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requireAuthContext(request)
    await deleteWedding(auth.user.id, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}
