import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserRoleInWedding } from '@/lib/permissions'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { ForbiddenError, ValidationError } from '@/lib/server/errors/app-error'

// PUT /api/weddings/[id]/participants/[userId] - 更新参与者权限（仅OWNER）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id: weddingId, userId } = await params
    const auth = await requireAuthContext(request)
    const currentRole = await getUserRoleInWedding(auth.user.id, weddingId)
    if (currentRole !== 'OWNER') {
      throw new ForbiddenError('Forbidden')
    }

    const body = await request.json()
    const { role } = body

    if (!role || (role !== 'OWNER' && role !== 'PARTICIPANT')) {
      throw new ValidationError('Valid role is required')
    }

    const participant = await prisma.weddingParticipant.update({
      where: {
        weddingId_userId: {
          weddingId,
          userId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({ participant })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// DELETE /api/weddings/[id]/participants/[userId] - 移除参与者（仅OWNER）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id: weddingId, userId } = await params
    const auth = await requireAuthContext(request)
    const currentRole = await getUserRoleInWedding(auth.user.id, weddingId)
    if (currentRole !== 'OWNER') {
      throw new ForbiddenError('Forbidden')
    }

    await prisma.weddingParticipant.delete({
      where: {
        weddingId_userId: {
          weddingId,
          userId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}
