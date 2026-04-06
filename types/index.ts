export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type UserRole = 'OWNER' | 'PARTICIPANT'

export interface Task {
  id: string
  weddingId: string
  title: string
  description: string | null
  owner: string
  status: TaskStatus
  timeFrame: string
  createdAt: Date
  updatedAt: Date
}

export interface Wedding {
  id: string
  name: string
  weddingDate: Date
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  username: string
  email: string | null
  createdAt: Date
  updatedAt: Date
}
