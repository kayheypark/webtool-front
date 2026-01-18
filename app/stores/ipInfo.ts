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
        // ipify API로 IP 주소 가져오기
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ip = ipData.ip

        // ip-api로 상세 정보 가져오기
        const detailResponse = await fetch(`http://ip-api.com/json/${ip}`)
        const detailData = await detailResponse.json()

        if (detailData.status === 'success') {
          this.ipInfo = {
            ip,
            country: detailData.country,
            region: detailData.regionName,
            city: detailData.city,
            isp: detailData.isp,
            fetchedAt: Date.now(),
          }
        } else {
          this.ipInfo = {
            ip,
            fetchedAt: Date.now(),
          }
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
