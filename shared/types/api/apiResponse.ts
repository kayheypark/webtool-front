export type ApiResponse<T> =
  | {
      success: true
      data: T & { message?: string }
    }
  | {
      success: false
      data?: T | null
      error: string
      errorCode: string
    }
