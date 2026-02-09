export const useI18nHelper = () => {
  const { locale, locales, setLocale } = useI18n()

  // 현재 로케일
  const currentLocale = computed(() => locale.value)

  // 사용 가능한 로케일 목록
  const availableLocales = computed(() => locales.value)

  // 로케일 변경 함수
  const changeLocale = (newLocale: string) => {
    setLocale(newLocale as 'ko' | 'en' | 'de' | 'ja')
  }

  // 현재 로케일 라벨 가져오기
  const currentLocaleLabel = computed(() => {
    const current = locales.value.find((l: { code: string }) => l.code === locale.value)
    return current?.name || locale.value
  })

  // 다른 로케일로 전환
  const toggleLocale = () => {
    const currentIndex = locales.value.findIndex((l: { code: string }) => l.code === locale.value)
    const nextIndex = (currentIndex + 1) % locales.value.length
    const nextLocale = locales.value[nextIndex]
    setLocale(nextLocale?.code as 'ko' | 'en' | 'de' | 'ja')
  }

  return {
    currentLocale,
    availableLocales,
    changeLocale,
    currentLocaleLabel,
    toggleLocale,
  }
}
