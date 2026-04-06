import { NextRequest, NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { createTask, listWeddingTasks } from '@/lib/server/services/task-service'

// GET /api/weddings/[id]/tasks - 获取婚礼的所有任务
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params
    const auth = await requireAuthContext(request)
    const data = await listWeddingTasks(auth.user.id, weddingId)

    return NextResponse.json(data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

// POST /api/weddings/[id]/tasks - 创建任务（仅OWNER）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params
    const auth = await requireAuthContext(request)
    const body = await request.json()
    const task = await createTask(auth.user.id, weddingId, body)

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
