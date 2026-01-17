// shared/types/api/auth/dto.ts

/**
 * @description 로그인 사용자 정보 조회
 * @method GET
 * @endpoint /api/v1/auth/info
 * @note httpOnly 쿠키 기반 요청이기 때문에 DTO 없음
 */
export type AuthInfoDTO = Record<string, never>

/**
 * @description 로그인
 * @method POST
 * @endpoint /api/v1/auth/login
 * @payloadType body
 */
export interface AuthLoginDTO {
  /**
   * @description 핸드폰 번호
   * @example '01012345678'
   */
  phoneNumber: string

  /**
   * @description 광고주 ID
   * @example 1
   */
  acctRowId: number
}

/**
 * @description 닉네임 중복 체크
 * @method GET
 * @endpoint /api/v1/auth/nickname/check
 * @payloadType query
 */
export interface AuthNicknameCheckDTO {
  /**
   * @description 확인할 닉네임 (2-20자, 한글/영문/숫자/._-)
   * @example '확인할닉네임123'
   */
  nickname: string
}
