// composables/useApi.ts

export const useApi = () => {
  const config = useRuntimeConfig()
  const { $i18n } = useNuxtApp()

  const apiFetch = $fetch.create({
    baseURL: (config.public.apiBase as string) || 'https://x.x.x.x/api/v1',
    credentials: 'include',
    onRequest() {},
    onRequestError() {
      // 네트워크 에러, CORS 정책 미통과 등 요청 자체가 실패한 경우
      const message = $i18n.t('frontMessages.NETWORK_ERROR')
      //alert($i18n.t('common.error'), message)

      throw new Error(message)
    },
    onResponseError({ response }) {
      const errorMessageKor = response._data?.error
      const errorCode = response._data?.errorCode

      const message = errorCode ? $i18n.t(`serverMessages.${errorCode}`) : errorMessageKor
      //alert($i18n.t('common.error'), message)

      throw new Error(message)
    },
  })

  return apiFetch
}
