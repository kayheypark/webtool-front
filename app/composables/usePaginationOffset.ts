// composables/usePaginationOffset.ts

import type { PaginationOffset, PaginationOffsetDTO } from '~~/shared/types/api/pagination'
import type { ApiResponse } from '~~/shared/types/api/apiResponse'

interface UsePaginationOffsetOptions<T> {
  size: number
  infiniteScroll: boolean
  fetcher: (dto: PaginationOffsetDTO) => Promise<ApiResponse<PaginationOffset<T>>>
}

export const usePaginationOffset = <T>(options: UsePaginationOffsetOptions<T>) => {
  const { size = 20, infiniteScroll = true, fetcher } = options

  const isLoading = ref(false)
  const list = ref<T[]>([]) as Ref<T[]>
  const page = ref(0)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const hasMore = ref(true)
  const hasPrevious = ref(false)

  const load = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    const currentPage = page.value
    page.value++

    try {
      const response = await fetcher({
        page: currentPage,
        size,
        offset: 0,
        limit: 0,
      })

      const data = response.data
      const newItems = data?.content ?? []

      if (infiniteScroll) {
        list.value.push(...newItems)
      } else {
        list.value = newItems
      }

      totalElements.value = data?.totalElements ?? 0
      totalPages.value = data?.totalPages ?? 0
      hasMore.value = data?.hasNext ?? false
      hasPrevious.value = data?.hasPrevious ?? false
    } catch (error) {
      console.error(error)
      page.value = currentPage
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 특정 페이지로 이동 (무한스크롤 비활성화 시 사용)
  const goToPage = async (targetPage: number) => {
    if (isLoading.value) return

    isLoading.value = true

    try {
      const response = await fetcher({
        page: targetPage,
        size,
        offset: 0,
        limit: 0,
      })

      const data = response.data
      list.value = data?.content ?? []
      page.value = targetPage

      totalElements.value = data?.totalElements ?? 0
      totalPages.value = data?.totalPages ?? 0
      hasMore.value = data?.hasNext ?? false
      hasPrevious.value = data?.hasPrevious ?? false
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    list.value = []
    page.value = 0
    totalElements.value = 0
    totalPages.value = 0
    hasMore.value = true
    hasPrevious.value = false
  }

  const reload = async () => {
    reset()
    await load()
  }

  // 무한스크롤 옵저버 (infiniteScroll 옵션이 true일 때만 사용)
  const observerTarget = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (!infiniteScroll) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
          load()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.value) {
      observer.observe(observerTarget.value)
    }
  }

  const destroyObserver = () => {
    observer?.disconnect()
    observer = null
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    destroyObserver()
  })

  return {
    // 상태
    isLoading: readonly(isLoading),
    list: readonly(list),
    page: readonly(page),
    totalElements: readonly(totalElements),
    totalPages: readonly(totalPages),
    hasMore: readonly(hasMore),
    hasPrevious: readonly(hasPrevious),
    // 메서드
    load,
    goToPage,
    reset,
    reload,
    // 옵저버 (infiniteScroll: true 일 때만 사용)
    observerTarget,
  }
}
