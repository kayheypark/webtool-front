// 싱글톤 패턴: 동적 타이틀 상태
const dynamicTitle = ref<string | null>(null)

export const useAppBar = () => {
  const setTitle = (title: string) => {
    dynamicTitle.value = title
  }

  const clearTitle = () => {
    dynamicTitle.value = null
  }

  return {
    dynamicTitle,
    setTitle,
    clearTitle,
  }
}
