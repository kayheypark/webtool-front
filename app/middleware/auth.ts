import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // hasAuth=true인 경우 auth:update 메시지를 기다림
  if (to.query.hasAuth === 'true') {
    if (import.meta.server) return
  }

  const authStore = useAuthStore()
  if (!authStore.loggedIn) {
    // 현재 URL을 returnUrl 쿼리로 전달
    const returnUrl = to.fullPath
    return navigateTo({
      path: '/auth/signin',
      query: { returnUrl },
    })
  }
})
