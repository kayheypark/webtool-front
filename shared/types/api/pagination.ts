export interface PaginationOffset<T> {
  content: T[]
  page: number // 현재 페이지 번호
  size: number // 페이지 크기
  totalElements: number // 전체 데이터 수
  totalPages: number // 전체 페이지 수
  hasNext: boolean // 다음 페이지 존재 여부
  hasPrevious: boolean // 이전 페이지 존재 여부
}

export interface PaginationCursor<T> {
  content: T[]
  nextCursor: number | null // 다음 커서 (다음 요청에 사용, null이면 마지막 페이지)
  hasNext: boolean //다음 페이지 존재 여부
  size: number //페이지 크기
}

export interface PaginationOffsetDTO {
  /**
   * @description 페이지 번호
   * @example 101
   */
  page: number

  /**
   * @description 페이지 크기
   * @example 20
   */
  size: number

  /**
   * @description 오프셋
   * @example 0
   */
  offset: number

  /**
   * @description 제한
   * @example 0
   */
  limit: number
}

export interface PaginationCursorDTO {
  /**
   * @description 페이지 크기 (기본값: 20, 최대: 100)
   * @example 0
   */
  size: number

  /**
   * @description 커서 (마지막으로 본 레코드의 ID, 첫 요청 시 생략)
   * @example 0
   */
  cursor?: number
}
