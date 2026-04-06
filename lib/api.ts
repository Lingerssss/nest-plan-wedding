// API客户端工具函数

import type { AuthClientType } from '@/types/auth'
import type {
  AuthResponse,
  CurrentUserResponse,
  TasksResponse,
  WeddingResponse,
  WeddingsResponse,
} from '@/types/contracts'
import type { CreateTaskInput, UpdateTaskInput } from '@/types/task'
import type { UpdateWeddingInput } from '@/types/wedding'

const API_BASE = '/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 认证API
export const authApi = {
  register: (
    username: string,
    password: string,
    email?: string,
    displayName?: string,
    clientType: AuthClientType = 'WEB'
  ) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, displayName, clientType }),
    }),

  login: (
    username: string,
    password: string,
    clientType: AuthClientType = 'WEB'
  ) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, clientType }),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => apiRequest<CurrentUserResponse>('/auth/me'),
}

// 婚礼API
export const weddingApi = {
  getAll: () => apiRequest<WeddingsResponse>('/weddings'),

  getById: (id: string) => apiRequest<WeddingResponse>(`/weddings/${id}`),

  create: (name: string, weddingDate: string) =>
    apiRequest<WeddingResponse>('/weddings', {
      method: 'POST',
      body: JSON.stringify({ name, weddingDate }),
    }),

  update: (id: string, data: UpdateWeddingInput) =>
    apiRequest<WeddingResponse>(`/weddings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/weddings/${id}`, {
      method: 'DELETE',
    }),

  addParticipant: (weddingId: string, userId: string, role: string) =>
    apiRequest<{ participant: unknown }>(`/weddings/${weddingId}/participants`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    }),

  updateParticipant: (weddingId: string, userId: string, role: string) =>
    apiRequest<{ participant: unknown }>(
      `/weddings/${weddingId}/participants/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }
    ),

  removeParticipant: (weddingId: string, userId: string) =>
    apiRequest<{ success: boolean }>(
      `/weddings/${weddingId}/participants/${userId}`,
      {
        method: 'DELETE',
      }
    ),
}

// 任务API
export const taskApi = {
  getByWedding: (weddingId: string) =>
    apiRequest<TasksResponse>(`/weddings/${weddingId}/tasks`),

  create: (weddingId: string, data: CreateTaskInput) =>
    apiRequest<{ task: import('@/types/task').TaskDto }>(`/weddings/${weddingId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateTaskInput) =>
    apiRequest<{ task: import('@/types/task').TaskDto }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
}
