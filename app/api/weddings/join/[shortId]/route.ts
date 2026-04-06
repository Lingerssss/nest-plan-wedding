import { NextRequest, NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import {
  joinWeddingByShortId,
  previewWeddingByShortId,
} from '@/lib/server/services/wedding-service'

// POST /api/weddings/join/[shortId] - 通过短ID加入婚礼
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const auth = await requireAuthContext(request)
    const { shortId } = await params
    const result = await joinWeddingByShortId(auth.user.id, shortId)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// GET /api/weddings/join/[shortId] - 获取婚礼信息（用于预览）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params
    const wedding = await previewWeddingByShortId(shortId)

    return NextResponse.json({ wedding })
  } catch (error) {
    return toErrorResponse(error)
  }
}
