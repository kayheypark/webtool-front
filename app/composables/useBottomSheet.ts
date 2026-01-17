import { BOTTOM_SHEET_DEFAULT_HEIGHT } from '~~/shared/constants/ui'

export type BottomSheetType = 'comment' | 'like'

export interface BottomSheetItem {
  id: number
  type: BottomSheetType
  props: Record<string, unknown>
  height: number
}

let sheetId = 0

const sheetList = reactive<BottomSheetItem[]>([])

export const useBottomSheet = () => {
  const open = (type: BottomSheetType, props?: Record<string, unknown>, height?: number) => {
    const id = ++sheetId
    sheetList.push({
      id,
      type,
      props: props ?? {},
      height: height ?? BOTTOM_SHEET_DEFAULT_HEIGHT,
    })
    return id
  }

  const close = (id: number) => {
    const index = sheetList.findIndex((s) => s.id === id)
    if (index === -1) return
    sheetList.splice(index, 1)
  }

  const closeTop = () => {
    if (sheetList.length > 0) {
      sheetList.pop()
    }
  }

  const hasSheet = computed(() => sheetList.length > 0)

  return {
    sheetList,
    hasSheet,
    open,
    close,
    closeTop,
  }
}
