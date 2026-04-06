export type AuthClientType = 'WEB' | 'MINIAPP'

export interface AuthUserDto {
  id: string
  username: string
  displayName: string | null
  email: string | null
  phone: string | null
}

export interface AuthContext {
  user: AuthUserDto
  token: string
  sessionId: string
  clientType: AuthClientType
  expiresAt: Date
}

export interface SessionResult {
  token: string
  expiresAt: Date
}

export interface LoginWithPasswordInput {
  username: string
  password: string
  clientType?: AuthClientType
}

export interface RegisterWithPasswordInput {
  username: string
  password: string
  email?: string
  displayName?: string
  clientType?: AuthClientType
}

export interface AuthSuccessResult {
  user: AuthUserDto
  accessToken: string
  expiresAt: Date
}
