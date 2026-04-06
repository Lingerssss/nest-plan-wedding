import type { AuthSuccessResult } from './auth'
import type { TaskDto, TaskGroupDto } from './task'
import type {
  JoinWeddingResultDto,
  WeddingDetailDto,
  WeddingListItemDto,
  WeddingPreviewDto,
} from './wedding'

export interface ErrorResponse {
  error: string
  code: string
  details?: unknown
}

export type AuthResponse = AuthSuccessResult

export interface CurrentUserResponse {
  user: AuthSuccessResult['user']
}

export interface WeddingsResponse {
  weddings: WeddingListItemDto[]
}

export interface WeddingResponse {
  wedding: WeddingDetailDto
}

export interface WeddingPreviewResponse {
  wedding: WeddingPreviewDto
}

export type JoinWeddingResponse = JoinWeddingResultDto

export interface TasksResponse {
  tasks: TaskDto[]
  taskGroups: TaskGroupDto[]
}
