export const useLocale = () => {
  const { t, locale, locales, setLocale } = useI18n()

  // 현재 locale 정보
  const currentLocale = computed(() => {
    return locales.value.find((l) => {
      if (typeof l === 'string') return l === locale.value
      return l.code === locale.value
    })
  })

  // locale 변경
  const changeLocale = async (code: 'ko' | 'en') => {
    await setLocale(code)
  }

  // 에러 코드를 번역된 메시지로 변환
  const getServerMessage = (code: string, fallback?: string) => {
    const key = `serverMessages.${code}`
    const translated = t(key)
    // 번역 키가 그대로 반환되면 fallback 사용
    if (translated === key) {
      return fallback || t('frontMessages.NO_TRANSLATION')
    }
    return translated
  }

  return {
    t,
    locale,
    locales,
    currentLocale,
    changeLocale,
    getServerMessage,
  }
}
