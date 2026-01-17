// composables/usePaginationCursor.ts

import type { PaginationCursor, PaginationCursorDTO } from '~~/shared/types/api/pagination'
import type { ApiResponse } from '~~/shared/types/api/apiResponse'

interface UsePaginationCursorOptions<T> {
  size?: number
  infiniteScroll?: boolean
  fetcher: (dto: PaginationCursorDTO) => Promise<ApiResponse<PaginationCursor<T>>>
}

export const usePaginationCursor = <T>(options: UsePaginationCursorOptions<T>) => {
  const { size = 20, infiniteScroll = true, fetcher } = options

  const isLoading = ref(false)
  const list = ref<T[]>([]) as Ref<T[]>
  const cursor = ref<number | undefined>(undefined)
  const nextCursor = ref<number | null>(null)
  const hasMore = ref(true)

  const load = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true

    try {
      const response = await fetcher({
        size,
        cursor: cursor.value,
      })

      const data = response.data
      const newItems = data?.content ?? []

      if (infiniteScroll) {
        list.value.push(...newItems)
      } else {
        list.value = newItems
      }

      nextCursor.value = data?.nextCursor ?? null
      hasMore.value = data?.hasNext ?? false
      cursor.value = nextCursor.value ?? undefined
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    list.value = []
    cursor.value = undefined
    nextCursor.value = null
    hasMore.value = true
  }

  const reload = async () => {
    reset()
    await load()
  }

  const prepend = (item: T) => {
    list.value.unshift(item)
  }

  const append = (item: T) => {
    list.value.push(item)
  }

  const merge = (newItems: T[], keyFn: (item: T) => string | number) => {
    const existingKeys = new Set(list.value.map(keyFn))
    const itemsToAdd = newItems.filter((item) => !existingKeys.has(keyFn(item)))
    list.value.push(...itemsToAdd)
  }

  const insertAfter = (
    item: T,
    targetKey: string | number,
    keyFn: (item: T) => string | number,
  ) => {
    const targetIndex = list.value.findIndex((i) => keyFn(i) === targetKey)
    if (targetIndex === -1) {
      list.value.push(item)
    } else {
      list.value.splice(targetIndex + 1, 0, item)
    }
  }

  const insertAfterGroup = (
    item: T,
    targetKey: string | number,
    keyFn: (item: T) => string | number,
    isGroupEnd: (item: T) => boolean,
  ) => {
    const targetIndex = list.value.findIndex((i) => keyFn(i) === targetKey)
    if (targetIndex === -1) {
      list.value.push(item)
      return
    }

    // 타겟 이후부터 그룹이 끝나는 지점 찾기
    let insertIndex = targetIndex + 1
    while (insertIndex < list.value.length && !isGroupEnd(list.value[insertIndex] as T)) {
      insertIndex++
    }

    list.value.splice(insertIndex, 0, item)
  }

  const remove = (targetKey: string | number, keyFn: (item: T) => string | number) => {
    const targetIndex = list.value.findIndex((i) => keyFn(i) === targetKey)
    if (targetIndex !== -1) {
      list.value.splice(targetIndex, 1)
    }
  }

  const update = (
    targetKey: string | number,
    keyFn: (item: T) => string | number,
    updater: (item: T) => T,
  ) => {
    const targetIndex = list.value.findIndex((i) => keyFn(i) === targetKey)
    if (targetIndex !== -1) {
      list.value[targetIndex] = updater(list.value[targetIndex] as T)
    }
  }

  // 무한스크롤 옵저버 (infiniteScroll 옵션이 true일 때만 사용)
  const observerTarget = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (!infiniteScroll || !observerTarget.value) return

    destroyObserver()

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
          load()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(observerTarget.value)
  }

  const destroyObserver = () => {
    observer?.disconnect()
    observer = null
  }

  watch(observerTarget, (newTarget) => {
    if (newTarget) {
      setupObserver()
    }
  })

  onUnmounted(() => {
    destroyObserver()
  })

  return {
    // 상태
    isLoading: readonly(isLoading),
    list: readonly(list),
    cursor: readonly(cursor),
    nextCursor: readonly(nextCursor),
    hasMore: readonly(hasMore),
    // 메서드
    load,
    reset,
    reload,
    prepend,
    append,
    merge,
    insertAfter,
    insertAfterGroup,
    remove,
    update,
    // 옵저버 (infiniteScroll: true 일 때만 사용)
    observerTarget,
  }
}
