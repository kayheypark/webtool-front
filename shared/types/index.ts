export const AuthProviderEnum = {
  GENERAL: '00',
  KAKAO: '01',
} as const
export type AuthProvider = (typeof AuthProviderEnum)[keyof typeof AuthProviderEnum]
