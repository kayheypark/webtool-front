import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // 이미 로그인한 사용자는 접근 불가
  if (authStore.loggedIn) {
    // returnUrl이 있으면 해당 경로로, 없으면 홈으로
    const returnUrl = to.query.returnUrl as string
    return navigateTo(returnUrl || '/', { replace: true })
  }
})
