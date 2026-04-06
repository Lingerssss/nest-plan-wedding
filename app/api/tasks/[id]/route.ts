import { NextRequest, NextResponse } from 'next/server'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { deleteTask, updateTask } from '@/lib/server/services/task-service'

// PUT /api/tasks/[id] - 更新任务
// OWNER可以修改所有字段，PARTICIPANT只能更新状态
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requireAuthContext(request)
    const body = await request.json()
    const task = await updateTask(auth.user.id, id, body)

    return NextResponse.json({ task })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// DELETE /api/tasks/[id] - 删除任务（仅OWNER）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requireAuthContext(request)
    await deleteTask(auth.user.id, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}
