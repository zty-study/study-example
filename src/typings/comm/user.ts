namespace Type {
  export interface User extends Common {
    email?: string
    account: string
    avatar?: string
    gender?: 0 | 1 | 2
    nickname?: string
    login_time?: number
    description?: string
    role?: string
  }

  export interface UserLogin {
    user: User
    token?: string
  }

  export interface JwtHeader {
    data: {
      uid: number
      role: string
    }
    exp: number
    iat: number
    iss: string
    sub: string
  }

  export interface QueryParams {
    search: string
    only_trashed: boolean
    with_trashed: boolean
  }
}
