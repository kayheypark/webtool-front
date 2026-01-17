//services/auth.service.ts

import type { AuthLoginDTO } from '~~/shared/types/api/auth/dto'
import type { $Fetch } from 'nitropack'
import type { ApiResponse } from '~~/shared/types/api/apiResponse'
import type { AuthLoginResponse, AuthInfoResponse } from '~~/shared/types/api/auth/response'
export class AuthService {
  private $fetch: typeof $fetch

  constructor(fetchInstance: $Fetch) {
    this.$fetch = fetchInstance
  }

  async login(payload: AuthLoginDTO): Promise<ApiResponse<AuthLoginResponse>> {
    const response = await this.$fetch<ApiResponse<AuthLoginResponse>>('/auth/login', {
      method: 'POST',
      body: payload,
    })
    return response
  }

  async logout() {
    return true
  }

  async info(): Promise<ApiResponse<AuthInfoResponse>> {
    const response = await this.$fetch<ApiResponse<AuthInfoResponse>>('/auth/info', {
      method: 'GET',
    })
    return response
  }
}
