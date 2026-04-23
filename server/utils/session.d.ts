declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    displayName: string | null
  }

  interface UserSession {
    user: User
  }
}

export {}
