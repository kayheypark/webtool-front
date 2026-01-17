// shared/types/api/auth/response.ts

/**
 * @description 로그인 사용자 정보 조회
 * @method GET
 * @endpoint /api/v1/auth/info
 * @note httpOnly 쿠키 기반 요청이기 때문에 DTO 없음
 */
export type AuthInfoResponse = AuthLoginResponse

/**
 * @description 로그인 응답
 * @method POST
 * @endpoint /api/v1/auth/login
 * @payloadType body
 */
export interface AuthLoginResponse {
  /**
   * @description 사용자 고유 ID
   * @example 174322
   */
  userRowId: number

  /**
   * @description 사용자 고유 ID
   * @example '0a14b09fa9d184c16573780ed4adaa18491976b32ba0766622fe412cc69d9e6c'
   */
  userId: string

  /**
   * @description 닉네임
   * @example '상냥한금붕어_174322'
   */
  nickname: string

  /**
   * @description 프로필 이미지
   * @example 'example.png'
   */
  profileImage: string | null

  /**
   * @description 사용자 상태 코드
   * @example '01'
   */
  userStatusCode: string

  /**
   * @description 소셜 타입 코드 (00:일반, 01:카카오)
   * @example '00' | '01'
   */
  socialTypeCode: string

  /**
   * @description 핸드폰 번호
   * @example '01012345678'
   */
  phoneNumber: string
}

/**
 * @description 닉네임 중복 체크 응답
 * @method GET
 * @endpoint /api/v1/auth/nickname/check
 * @payloadType query
 */
export interface AuthNicknameCheckResponse {
  /**
   * @description 결과 코드 (NC000: 사용가능)
   * @example 'NC000'
   */
  resultCode: string
}
