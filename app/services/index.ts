// services/index.ts

import { AuthService } from './auth.service'

import type { $Fetch } from 'nitropack'

export interface Services {
  auth: AuthService
}

export const createServices = (fetchInstance: $Fetch): Services => {
  return {
    auth: new AuthService(fetchInstance),
  }
}
