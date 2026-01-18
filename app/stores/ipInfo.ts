import { defineStore } from 'pinia'

interface IPInfo {
  ip: string
  country?: string
  region?: string
  city?: string
  isp?: string
  fetchedAt?: number // timestamp
}

export const useIPInfoStore = defineStore('ipInfo', {
  state: () => ({
    ipInfo: null as IPInfo | null,
  }),

  getters: {
    isExpired(): boolean {
      if (!this.ipInfo?.fetchedAt) return true
      const oneMonth = 30 * 24 * 60 * 60 * 1000 // 30일
      const now = Date.now()
      return now - this.ipInfo.fetchedAt > oneMonth
    },

    hasValidCache(): boolean {
      return this.ipInfo !== null && !this.isExpired
    },
  },

  actions: {
    async fetchIPInfo(force = false) {
      // 강제 갱신이 아니고 유효한 캐시가 있으면 캐시 반환
      if (!force && this.hasValidCache && this.ipInfo) {
        return this.ipInfo
      }

      try {
        // Nuxt API를 통해 IP 정보 가져오기
        const data = await $fetch<{
          ip: string
          country?: string
          region?: string
          city?: string
          isp?: string
        }>('/api/ip-info')

        this.ipInfo = {
          ...data,
          fetchedAt: Date.now(),
        }

        return this.ipInfo
      } catch (error) {
        console.error('IP 정보 조회 실패:', error)
        throw error
      }
    },

    clearCache() {
      this.ipInfo = null
    },
  },

  persist: true,
})
