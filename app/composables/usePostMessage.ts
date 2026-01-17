import { useIframe } from './useIframe'

export const usePostMessage = () => {
  const postMessage = (type: string, data: unknown = null) => {
    try {
      if (useIframe().isIframe.value) {
        window.parent.postMessage({ type, data }, '*')
      }
    } catch (error) {
      console.error('Post message failed:', error)
    }
  }

  return { postMessage }
}
