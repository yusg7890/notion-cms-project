export interface ApiError {
  message: string
  code: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}

export interface PaginatedResponse<T> {
  items: T[]
  nextCursor?: string
  hasMore: boolean
}
