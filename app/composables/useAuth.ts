// composables/useAuth.ts

import type { AuthProvider } from '~~/shared/types'
import type { AuthLoginResponse } from '~~/shared/types/api/auth/response'
import { useAuthStore } from '~~/stores/auth'
import { useReturnUrl } from '~/composables/useReturnUrl'

export const useAuth = () => {
  const services = useServices()
  const authStore = useAuthStore()

  const isLoading = ref(false)

  const login = async (payload: {
    phoneNumber: string
    acctRowId: number
    authProvider?: AuthProvider
  }) => {
    isLoading.value = true

    try {
      const response = await services.auth.login({
        phoneNumber: payload.phoneNumber,
        acctRowId: payload.acctRowId,
      })

      if (!response.success) {
        throw new Error(response.error)
      }

      updateProfile(response.data)

      authStore.phoneNumber = payload.phoneNumber
      authStore.acctRowId = payload.acctRowId
      authStore.loggedIn = true

      if (payload.authProvider) {
        authStore.authProvider = payload.authProvider
      }

      // returnUrl 로직 처리
      useReturnUrl().handleReturnUrl()

      //아이프레임으로 해당 프로젝트를 호출한 경우 호출한 홈페이지에 로그인 정보를 알림
      usePostMessage().postMessage('state:update', JSON.parse(JSON.stringify(authStore.$state)))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    authStore.loggedIn = false
    authStore.phoneNumber = null
    authStore.acctRowId = null
    authStore.authProvider = null
    authStore.nickname = null
    authStore.profileImage = null
    authStore.userStatusCode = null
    authStore.socialTypeCode = null
    authStore.userRowId = null
    authStore.userId = null

    //아이프레임으로 해당 프로젝트를 호출한 경우 호출한 홈페이지에 로그아웃 정보를 알림
    usePostMessage().postMessage('state:update', JSON.parse(JSON.stringify(authStore.$state)))
  }

  const updateProfile = (response: AuthLoginResponse) => {
    authStore.nickname = response.nickname
    authStore.profileImage = response.profileImage
    authStore.userStatusCode = response.userStatusCode
    authStore.socialTypeCode = response.socialTypeCode
    authStore.userRowId = response.userRowId
    authStore.userId = response.userId
    authStore.phoneNumber = response.phoneNumber
  }

  const kakaoLoginUrlFormat = (acctRowId: string) => {
    const config = useRuntimeConfig()
    const kakaoSecret = config.public.kakaoSecret
    const apiBase = config.public.apiBase
    const socialTypeCode = 'KAKAO'
    const returnUrl = useRoute().path // example: /profile
    const returnUrlEncoded = encodeURIComponent(returnUrl) // example: /profile -> %2Fprofile
    return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoSecret}&redirect_uri=${apiBase}/auth/social/callback&response_type=code&state=${socialTypeCode}|${acctRowId}|${returnUrlEncoded}`
  }

  const kakaoLoginPageOpen = () => {
    //TODO: acctRowId를 동적으로 받아오기
    //ex: 부모 아이프레임에서 set:siteCode postMessage 를 통해 받아오기
    const acctRowId = authStore.acctRowId ?? 1
    if (!acctRowId) {
      useModal().alert('오류', '카카오로그인 페이지 열기 전 acctRowId가 설정되지 않았습니다.')
      return
    }

    const url = kakaoLoginUrlFormat(acctRowId.toString())

    useNavigation().thirdPartyOpen(url)
  }

  const setLoggedIn = (loggedIn: boolean) => {
    authStore.loggedIn = loggedIn
  }

  const setAuthProvider = (authProvider: AuthProvider) => {
    authStore.authProvider = authProvider
  }

  const setAcctRowId = (acctRowId: number) => {
    authStore.acctRowId = acctRowId
  }

  return {
    login,
    logout,
    isLoading: readonly(isLoading),
    updateProfile,
    kakaoLoginUrlFormat,
    kakaoLoginPageOpen,
    setLoggedIn,
    setAuthProvider,
    setAcctRowId,
  }
}
