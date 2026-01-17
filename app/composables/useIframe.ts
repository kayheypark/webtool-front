// 싱글톤 패턴: 파일 스코프에 상태 선언
const isIframe = ref<boolean | null>(null)
const isFullpage = ref<boolean | null>(null)
let initialized = false

export const useIframe = () => {
  // 클라이언트에서 한 번만 초기화
  if (!initialized && import.meta.client) {
    onMounted(() => {
      isIframe.value = window.self !== window.top
      isFullpage.value = window.location.search.includes('isFullpage=true')
    })
    initialized = true
  }

  return { isIframe, isFullpage }
}
