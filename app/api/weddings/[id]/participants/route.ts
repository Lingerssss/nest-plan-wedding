import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserRoleInWedding } from '@/lib/permissions'
import { requireAuthContext } from '@/lib/server/auth/request-auth'
import { toErrorResponse } from '@/lib/server/errors/http-error'
import { ForbiddenError, ValidationError, NotFoundError, ConflictError } from '@/lib/server/errors/app-error'

// POST /api/weddings/[id]/participants - 添加参与者（仅OWNER）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params
    const auth = await requireAuthContext(request)
    const role = await getUserRoleInWedding(auth.user.id, weddingId)
    if (role !== 'OWNER') {
      throw new ForbiddenError('Forbidden')
    }

    const body = await request.json()
    const { userId, role: nextRole = 'PARTICIPANT' } = body

    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (nextRole !== 'OWNER' && nextRole !== 'PARTICIPANT') {
      throw new ValidationError('Invalid role')
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // 检查是否已经是参与者
    const existing = await prisma.weddingParticipant.findUnique({
      where: {
        weddingId_userId: {
          weddingId,
          userId,
        },
      },
    })

    if (existing) {
      throw new ConflictError('User is already a participant')
    }

    const participant = await prisma.weddingParticipant.create({
      data: {
        weddingId,
        userId,
        role: nextRole,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({ participant }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
