// composables/useModal.ts

type ModalType = 'alert' | 'confirm'

export interface ModalItem {
  id: number
  type: ModalType
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
}

let modalId = 0

const modalList = reactive<ModalItem[]>([])

export const useModal = () => {
  const alert = (title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      const id = ++modalId
      modalList.push({
        id,
        type: 'alert',
        title,
        message,
        onConfirm: () => resolve(),
      })
    })
  }

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = ++modalId
      modalList.push({
        id,
        type: 'confirm',
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })
  }

  const close = (id: number, confirmed: boolean = true) => {
    const index = modalList.findIndex((m) => m.id === id)
    if (index === -1) return

    const modal = modalList[index]
    if (!modal) return

    if (confirmed && modal.onConfirm) {
      modal.onConfirm()
    } else if (!confirmed && modal.onCancel) {
      modal.onCancel()
    }

    modalList.splice(index, 1)
  }

  return {
    modalList,
    alert,
    confirm,
    close,
  }
}
