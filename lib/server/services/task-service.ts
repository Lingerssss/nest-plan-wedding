import { prisma } from '@/lib/db'
import { getUserRoleInWedding } from '@/lib/permissions'
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/lib/server/errors/app-error'
import type { CreateTaskInput, TaskDto, TaskGroupDto, TaskPhase, TaskStatus, UpdateTaskInput } from '@/types/task'
import type { UserRole } from '@/types/wedding'

const VALID_TASK_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
const VALID_TASK_PHASES: TaskPhase[] = ['PREPARATION', 'WEDDING_DAY']

function parseOptionalDate(value?: string | null) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError('Invalid date value')
  }

  return parsed
}

function assertTaskStatus(status?: string): asserts status is TaskStatus | undefined {
  if (status && !VALID_TASK_STATUSES.includes(status as TaskStatus)) {
    throw new ValidationError('Invalid status')
  }
}

function assertTaskPhase(phase?: string): asserts phase is TaskPhase | undefined {
  if (phase && !VALID_TASK_PHASES.includes(phase as TaskPhase)) {
    throw new ValidationError('Invalid phase')
  }
}

async function getRoleOrThrow(userId: string, weddingId: string): Promise<UserRole> {
  const role = await getUserRoleInWedding(userId, weddingId)
  if (!role) {
    throw new ForbiddenError('Forbidden')
  }

  return role
}

async function assertAssignableUser(weddingId: string, assignedUserId?: string | null) {
  if (!assignedUserId) {
    return
  }

  const participant = await prisma.weddingParticipant.findUnique({
    where: {
      weddingId_userId: {
        weddingId,
        userId: assignedUserId,
      },
    },
  })

  if (!participant) {
    throw new ValidationError('Assigned user must be a participant of this wedding')
  }
}

export function toTaskDto(task: {
  id: string
  weddingId: string
  title: string
  description: string | null
  owner: string
  assignedUserId: string | null
  assignedUser?: { id: string; username: string } | null
  status: string
  phase: string
  timeFrame: string
  scheduledAt: Date | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}): TaskDto {
  return {
    id: task.id,
    weddingId: task.weddingId,
    title: task.title,
    description: task.description,
    owner: task.owner,
    assignedUserId: task.assignedUserId,
    assignedUser: task.assignedUser || null,
    status: task.status as TaskStatus,
    phase: task.phase as TaskPhase,
    timeFrame: task.timeFrame,
    scheduledAt: task.scheduledAt?.toISOString() || null,
    sortOrder: task.sortOrder,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

export function groupTasks(tasks: TaskDto[]): TaskGroupDto[] {
  const grouped = new Map<string, TaskGroupDto>()

  for (const task of tasks) {
    const key = `${task.phase}:${task.timeFrame}`
    const existing = grouped.get(key)

    if (existing) {
      existing.tasks.push(task)
      continue
    }

    grouped.set(key, {
      key,
      label: task.timeFrame,
      phase: task.phase,
      tasks: [task],
    })
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      tasks: group.tasks.sort((a, b) => {
        const aTime = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
        const bTime = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
        return a.sortOrder - b.sortOrder || aTime - bTime || a.createdAt.localeCompare(b.createdAt)
      }),
    }))
    .sort((a, b) => {
      const phaseCompare = a.phase.localeCompare(b.phase)
      if (phaseCompare !== 0) {
        return phaseCompare
      }

      return a.tasks[0].sortOrder - b.tasks[0].sortOrder
    })
}

export async function listWeddingTasks(userId: string, weddingId: string) {
  await getRoleOrThrow(userId, weddingId)

  const tasks = await prisma.task.findMany({
    where: { weddingId },
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
  })

  const mappedTasks = tasks.map(toTaskDto)

  return {
    tasks: mappedTasks,
    taskGroups: groupTasks(mappedTasks),
  }
}

export async function createTask(userId: string, weddingId: string, input: CreateTaskInput) {
  const role = await getRoleOrThrow(userId, weddingId)
  if (role !== 'OWNER') {
    throw new ForbiddenError('Forbidden')
  }

  if (!input.title || !input.owner || !input.timeFrame) {
    throw new ValidationError('Title, owner, and timeFrame are required')
  }

  assertTaskStatus(input.status)
  assertTaskPhase(input.phase)
  await assertAssignableUser(weddingId, input.assignedUserId)

  const task = await prisma.task.create({
    data: {
      weddingId,
      title: input.title,
      description: input.description || null,
      owner: input.owner,
      assignedUserId: input.assignedUserId || null,
      status: input.status || 'PENDING',
      phase: input.phase || 'PREPARATION',
      timeFrame: input.timeFrame,
      scheduledAt: parseOptionalDate(input.scheduledAt),
      sortOrder: input.sortOrder || 0,
    },
    include: {
      assignedUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  return toTaskDto(task)
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  const role = await getRoleOrThrow(userId, task.weddingId)

  assertTaskStatus(input.status)
  assertTaskPhase(input.phase)

  if (role === 'PARTICIPANT') {
    const disallowedFields = ['title', 'description', 'owner', 'phase', 'timeFrame', 'assignedUserId', 'scheduledAt', 'sortOrder']
      .some((field) => field in input)

    if (disallowedFields) {
      throw new ForbiddenError('Participants can only update task status')
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.status ? { status: input.status } : {}),
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return toTaskDto(updatedTask)
  }

  await assertAssignableUser(task.weddingId, input.assignedUserId)

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.owner ? { owner: input.owner } : {}),
      ...(input.assignedUserId !== undefined ? { assignedUserId: input.assignedUserId || null } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.phase ? { phase: input.phase } : {}),
      ...(input.timeFrame ? { timeFrame: input.timeFrame } : {}),
      ...(input.scheduledAt !== undefined ? { scheduledAt: parseOptionalDate(input.scheduledAt) } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
    include: {
      assignedUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  return toTaskDto(updatedTask)
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      weddingId: true,
    },
  })

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  const role = await getRoleOrThrow(userId, task.weddingId)
  if (role !== 'OWNER') {
    throw new ForbiddenError('Forbidden')
  }

  await prisma.task.delete({
    where: { id: taskId },
  })
}
