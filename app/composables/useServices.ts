// composables/useServices.ts
// plugins/services.ts에서 provide된 Services 인스턴스를 가져옴

import type { Services } from '~/services'

export const useServices = (): Services => {
  const { $services } = useNuxtApp()
  return $services as Services
}
