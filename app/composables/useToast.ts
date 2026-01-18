interface ToastState {
  message: string
  show: boolean
  timeout?: NodeJS.Timeout
}

const toastState = reactive<ToastState>({
  message: '',
  show: false,
})

export const useToast = () => {
  const showToast = (message: string, duration = 2000) => {
    // 기존 타임아웃이 있다면 클리어
    if (toastState.timeout) {
      clearTimeout(toastState.timeout)
    }

    toastState.message = message
    toastState.show = true

    toastState.timeout = setTimeout(() => {
      toastState.show = false
    }, duration)
  }

  const hideToast = () => {
    if (toastState.timeout) {
      clearTimeout(toastState.timeout)
    }
    toastState.show = false
  }

  return {
    toastMessage: computed(() => toastState.message),
    showToastState: computed(() => toastState.show),
    showToast,
    hideToast,
  }
}
