import { prisma } from './db'
import { getCurrentUser } from './auth'

// Re-export getCurrentUser for convenience
export { getCurrentUser }

export type UserRole = 'OWNER' | 'PARTICIPANT'

export async function getUserRoleInWedding(
  userId: string,
  weddingId: string
): Promise<UserRole | null> {
  const participant = await prisma.weddingParticipant.findUnique({
    where: {
      weddingId_userId: {
        weddingId,
        userId,
      },
    },
  })

  if (!participant) {
    // 检查是否是创建人
    const wedding = await prisma.wedding.findUnique({
      where: { id: weddingId },
    })
    
    if (wedding?.createdById === userId) {
      return 'OWNER'
    }
    
    return null
  }

  return participant.role as UserRole
}

export async function checkWeddingAccess(
  userId: string,
  weddingId: string
): Promise<boolean> {
  const role = await getUserRoleInWedding(userId, weddingId)
  return role !== null
}

export async function checkOwnerAccess(
  userId: string,
  weddingId: string
): Promise<boolean> {
  const role = await getUserRoleInWedding(userId, weddingId)
  return role === 'OWNER'
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireWeddingAccess(weddingId: string) {
  const user = await requireAuth()
  const hasAccess = await checkWeddingAccess(user.id, weddingId)
  if (!hasAccess) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireOwnerAccess(weddingId: string) {
  const user = await requireAuth()
  const isOwner = await checkOwnerAccess(user.id, weddingId)
  if (!isOwner) {
    throw new Error('Forbidden: Owner access required')
  }
  return user
}
