import { prisma } from '@/lib/db'
import { getUserRoleInWedding } from '@/lib/permissions'
import { buildTaskTemplatePayloads } from '@/lib/weddingTemplates'
import { generateUniqueShortId } from '@/lib/shortId'
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/lib/server/errors/app-error'
import { groupTasks, toTaskDto } from '@/lib/server/services/task-service'
import type { CreateWeddingInput, JoinWeddingResultDto, UpdateWeddingInput, WeddingDetailDto, WeddingListItemDto, WeddingPreviewDto } from '@/types/wedding'

async function requireWeddingRole(userId: string, weddingId: string) {
  const role = await getUserRoleInWedding(userId, weddingId)
  if (!role) {
    throw new ForbiddenError('Forbidden')
  }

  return role
}

async function requireOwnerRole(userId: string, weddingId: string) {
  const role = await requireWeddingRole(userId, weddingId)
  if (role !== 'OWNER') {
    throw new ForbiddenError('Forbidden')
  }
}

function toWeddingParticipantDto(participant: {
  id: string
  userId: string
  role: string
  user: {
    username: string
  }
}) {
  return {
    id: participant.id,
    userId: participant.userId,
    username: participant.user.username,
    role: participant.role as 'OWNER' | 'PARTICIPANT',
  }
}

function toWeddingListItemDto(
  wedding: {
    id: string
    shortId: string
    name: string
    weddingDate: Date
    createdById: string
    creator: { username: string }
    participants: Array<{
      id: string
      userId: string
      role: string
      user: { username: string }
    }>
    tasks: Array<{ status: string }>
  },
  currentUserId: string
): WeddingListItemDto {
  const completed = wedding.tasks.filter((task) => task.status === 'COMPLETED').length
  const participantRole = wedding.createdById === currentUserId
    ? 'OWNER'
    : (wedding.participants.find((participant) => participant.userId === currentUserId)?.role as 'OWNER' | 'PARTICIPANT' | undefined) || 'PARTICIPANT'

  return {
    id: wedding.id,
    shortId: wedding.shortId,
    name: wedding.name,
    weddingDate: wedding.weddingDate.toISOString(),
    createdById: wedding.createdById,
    creatorName: wedding.creator.username,
    role: participantRole,
    participants: wedding.participants.map(toWeddingParticipantDto),
    taskSummary: {
      total: wedding.tasks.length,
      completed,
    },
  }
}

function toWeddingDetailDto(
  wedding: {
    id: string
    shortId: string
    name: string
    weddingDate: Date
    createdById: string
    creator: { username: string }
    participants: Array<{
      id: string
      userId: string
      role: string
      user: { username: string }
    }>
    tasks: Array<{
      id: string
      weddingId: string
      title: string
      description: string | null
      owner: string
      assignedUserId: string | null
      assignedUser: { id: string; username: string } | null
      status: string
      phase: string
      timeFrame: string
      scheduledAt: Date | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }>
  },
  userId: string
): WeddingDetailDto {
  const role = wedding.createdById === userId
    ? 'OWNER'
    : (wedding.participants.find((participant) => participant.userId === userId)?.role as 'OWNER' | 'PARTICIPANT' | undefined) || 'PARTICIPANT'
  const tasks = wedding.tasks.map(toTaskDto)

  return {
    id: wedding.id,
    shortId: wedding.shortId,
    name: wedding.name,
    weddingDate: wedding.weddingDate.toISOString(),
    createdById: wedding.createdById,
    creatorName: wedding.creator.username,
    role,
    participants: wedding.participants.map(toWeddingParticipantDto),
    tasks,
    taskGroups: groupTasks(tasks),
  }
}

async function loadWeddingDetailOrThrow(weddingId: string) {
  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId },
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      tasks: {
        include: {
          assignedUser: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: [
          { phase: 'asc' },
          { sortOrder: 'asc' },
          { scheduledAt: 'asc' },
          { createdAt: 'asc' },
        ],
      },
    },
  })

  if (!wedding) {
    throw new NotFoundError('Wedding not found')
  }

  return wedding
}

export async function listUserWeddings(userId: string) {
  const weddings = await prisma.wedding.findMany({
    where: {
      OR: [
        { createdById: userId },
        {
          participants: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      tasks: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      weddingDate: 'asc',
    },
  })

  return weddings.map((wedding) => toWeddingListItemDto(wedding, userId))
}

export async function getWeddingDetail(userId: string, weddingId: string) {
  const wedding = await loadWeddingDetailOrThrow(weddingId)
  const role = wedding.createdById === userId
    ? 'OWNER'
    : (wedding.participants.find((participant) => participant.userId === userId)?.role as 'OWNER' | 'PARTICIPANT' | undefined) || null

  if (!role) {
    throw new ForbiddenError('Forbidden')
  }

  return toWeddingDetailDto(wedding, userId)
}

export async function createWedding(userId: string, input: CreateWeddingInput) {
  if (!input.name || !input.weddingDate) {
    throw new ValidationError('Name and wedding date are required')
  }

  const weddingDate = new Date(input.weddingDate)
  if (Number.isNaN(weddingDate.getTime())) {
    throw new ValidationError('Invalid wedding date')
  }

  const shortId = await generateUniqueShortId()
  const wedding = await prisma.wedding.create({
    data: {
      shortId,
      name: input.name,
      weddingDate,
      createdById: userId,
      participants: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  })

  const taskPayloads = buildTaskTemplatePayloads(weddingDate)
  await prisma.task.createMany({
    data: taskPayloads.map((task) => ({
      weddingId: wedding.id,
      ...task,
    })),
  })

  return getWeddingDetail(userId, wedding.id)
}

export async function updateWedding(userId: string, weddingId: string, input: UpdateWeddingInput) {
  await requireOwnerRole(userId, weddingId)

  const nextWeddingDate = input.weddingDate ? new Date(input.weddingDate) : undefined
  if (input.weddingDate && Number.isNaN(nextWeddingDate?.getTime())) {
    throw new ValidationError('Invalid wedding date')
  }

  await prisma.wedding.update({
    where: { id: weddingId },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.weddingDate ? { weddingDate: nextWeddingDate } : {}),
    },
  })

  return getWeddingDetail(userId, weddingId)
}

export async function deleteWedding(userId: string, weddingId: string) {
  await requireOwnerRole(userId, weddingId)
  await prisma.wedding.delete({
    where: { id: weddingId },
  })
}

export async function previewWeddingByShortId(shortId: string): Promise<WeddingPreviewDto> {
  if (!shortId || shortId.length !== 6 || !/^\d+$/.test(shortId)) {
    throw new ValidationError('Invalid short ID format. Must be 6 digits.')
  }

  const wedding = await prisma.wedding.findUnique({
    where: { shortId },
    select: {
      id: true,
      shortId: true,
      name: true,
      weddingDate: true,
      creator: {
        select: {
          username: true,
        },
      },
    },
  })

  if (!wedding) {
    throw new NotFoundError('Wedding not found')
  }

  return {
    id: wedding.id,
    shortId: wedding.shortId,
    name: wedding.name,
    weddingDate: wedding.weddingDate.toISOString(),
    creatorName: wedding.creator.username,
  }
}

export async function joinWeddingByShortId(userId: string, shortId: string): Promise<JoinWeddingResultDto> {
  if (!shortId || shortId.length !== 6 || !/^\d+$/.test(shortId)) {
    throw new ValidationError('Invalid short ID format. Must be 6 digits.')
  }

  const wedding = await prisma.wedding.findUnique({
    where: { shortId },
    include: {
      participants: true,
    },
  })

  if (!wedding) {
    throw new NotFoundError('Wedding not found')
  }

  if (wedding.participants.some((participant) => participant.userId === userId)) {
    throw new ConflictError('You are already a participant of this wedding')
  }

  await prisma.weddingParticipant.create({
    data: {
      weddingId: wedding.id,
      userId,
      role: 'PARTICIPANT',
    },
  })

  return {
    wedding: await getWeddingDetail(userId, wedding.id),
  }
}
