import { FULLPAGE } from '~~/shared/constants/postMessageEvent'
export const useNavigation = () => {
  const go = (url: string) => {
    if (useIframe().isIframe.value && !useIframe().isFullpage.value) {
      //아이프레임 내부에서 동작 할 경우
      //부모 창에 postMessage 를 보내서 페이지 이동을 명령함
      usePostMessage().postMessage(FULLPAGE.OPEN, { url })
    } else {
      //독립적으로 동작 할 경우
      //단순 페이지 이동
      navigateTo(url)
    }
  }

  const thirdPartyOpen = (url: string) => {
    if (useIframe().isIframe.value && !useIframe().isFullpage.value) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }

  return { go, thirdPartyOpen }
}
