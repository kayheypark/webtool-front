// plugins/services.ts
// 앱 시작 시 Services 인스턴스를 초기화하는 플러그인

import { createServices } from '~/services'

export default defineNuxtPlugin(() => {
  const api = useApi()
  const services = createServices(api)
  // provide로 전역에 주입
  return {
    provide: {
      services,
    },
  }
})
