//composables/useReturnUrl.ts
export const useReturnUrl = () => {
  //isReplace
  const handleReturnUrl = (isReplace: boolean = false) => {
    // returnUrl 로직 처리
    const route = useRoute()
    const returnUrl = route.query.returnUrl as string

    if (returnUrl) {
      // 상대 경로인지 확인하고 안전하게 리다이렉트
      try {
        // 절대 URL인 경우 같은 도메인인지 확인 (클라이언트 사이드에서만)
        if (
          typeof window !== 'undefined' &&
          (returnUrl.startsWith('http://') || returnUrl.startsWith('https://'))
        ) {
          const url = new URL(returnUrl)
          // 같은 도메인인 경우에만 리다이렉트
          if (url.origin === window.location.origin) {
            navigateTo(returnUrl, { replace: isReplace })
          } else {
            navigateTo('/')
          }
        } else {
          // 상대 경로인 경우 그대로 사용
          navigateTo(returnUrl, { replace: isReplace })
        }
      } catch (error) {
        // URL 파싱 실패 시 기본 페이지로
        console.error('Invalid returnUrl:', error)
        navigateTo('/')
      }
    } else {
      navigateTo('/')
    }
  }

  return {
    handleReturnUrl,
  }
}
