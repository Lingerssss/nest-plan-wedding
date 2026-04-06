export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPhase = 'PREPARATION' | 'WEDDING_DAY'

export interface TaskAssigneeDto {
  id: string
  username: string
}

export interface TaskDto {
  id: string
  weddingId: string
  title: string
  description: string | null
  owner: string
  assignedUserId: string | null
  assignedUser: TaskAssigneeDto | null
  status: TaskStatus
  phase: TaskPhase
  timeFrame: string
  scheduledAt: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TaskGroupDto {
  key: string
  label: string
  phase: TaskPhase
  tasks: TaskDto[]
}

export interface CreateTaskInput {
  title: string
  description?: string
  owner: string
  status?: TaskStatus
  phase?: TaskPhase
  timeFrame: string
  assignedUserId?: string | null
  scheduledAt?: string | null
  sortOrder?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  owner?: string
  status?: TaskStatus
  phase?: TaskPhase
  timeFrame?: string
  assignedUserId?: string | null
  scheduledAt?: string | null
  sortOrder?: number
}
