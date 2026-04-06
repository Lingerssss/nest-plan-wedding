import type { TaskDto, TaskGroupDto } from './task'

export type UserRole = 'OWNER' | 'PARTICIPANT'

export interface WeddingParticipantDto {
  id: string
  userId: string
  username: string
  role: UserRole
}

export interface WeddingListItemDto {
  id: string
  shortId: string
  name: string
  weddingDate: string
  createdById: string
  creatorName: string
  role: UserRole
  participants: WeddingParticipantDto[]
  taskSummary: {
    total: number
    completed: number
  }
}

export interface WeddingPreviewDto {
  id: string
  shortId: string
  name: string
  weddingDate: string
  creatorName: string
}

export interface WeddingDetailDto {
  id: string
  shortId: string
  name: string
  weddingDate: string
  createdById: string
  creatorName: string
  role: UserRole
  participants: WeddingParticipantDto[]
  tasks: TaskDto[]
  taskGroups: TaskGroupDto[]
}

export interface JoinWeddingResultDto {
  wedding: WeddingDetailDto
}

export interface CreateWeddingInput {
  name: string
  weddingDate: string
}

export interface UpdateWeddingInput {
  name?: string
  weddingDate?: string
}
