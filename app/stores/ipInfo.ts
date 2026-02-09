import { defineStore } from 'pinia'

interface IPInfo {
  ip: string
  country?: string
  region?: string
  city?: string
  isp?: string
  fetchedAt: number // timestamp when fetched
}

interface IPHistoryEntry {
  ip: string
  info: IPInfo
  lastChecked: number
}

export const useIPInfoStore = defineStore('ipInfo', {
  state: () => ({
    currentIPInfo: null as IPInfo | null,
    ipHistory: [] as IPHistoryEntry[], // 여러 IP 정보를 저장
  }),

  getters: {
    // 현재 IP에 대한 캐시가 있는지 확인
    hasCurrentIPCache: (state) => (currentIP: string): boolean => {
      const entry = state.ipHistory.find(e => e.ip === currentIP)
      if (!entry) return false

      // 24시간 이내 데이터만 유효한 것으로 간주
      const oneDay = 24 * 60 * 60 * 1000
      const now = Date.now()
      return (now - entry.lastChecked) < oneDay
    },

    // 특정 IP의 캐시 데이터 가져오기
    getCachedIPInfo: (state) => (ip: string): IPInfo | null => {
      const entry = state.ipHistory.find(e => e.ip === ip)
      return entry?.info || null
    },
  },

  actions: {
    // 먼저 현재 IP 주소만 가져오기 (빠른 체크)
    async getCurrentIP(): Promise<string> {
      try {
        // 서버 API를 통해 IP 조회 (서버에서 공인 IP 처리)
        const response = await $fetch<{ ip: string }>('/api/ip-info')
        return response.ip
      } catch (error) {
        console.error('현재 IP 조회 실패:', error)
        throw error
      }
    },

    async fetchIPInfo(forceRefresh = false): Promise<IPInfo> {
      try {
        // 1. 먼저 현재 IP 가져오기
        const currentIP = await this.getCurrentIP()

        // 2. 강제 새로고침이 아니고 캐시가 있으면 캐시 반환
        if (!forceRefresh && this.hasCurrentIPCache(currentIP)) {
          const cached = this.getCachedIPInfo(currentIP)
          if (cached) {
            console.log('캐시된 IP 정보 사용:', currentIP)
            this.currentIPInfo = cached

            // lastChecked 시간만 업데이트
            const entry = this.ipHistory.find(e => e.ip === currentIP)
            if (entry) {
              entry.lastChecked = Date.now()
            }

            return cached
          }
        }

        // 3. 캐시가 없거나 IP가 변경되었으면 새로 조회
        console.log('새로운 IP 정보 조회:', currentIP)
        const data = await $fetch<{
          ip: string
          country?: string
          region?: string
          city?: string
          isp?: string
        }>('/api/ip-info')

        const newIPInfo: IPInfo = {
          ...data,
          fetchedAt: Date.now(),
        }

        // 4. 현재 IP 정보 업데이트
        this.currentIPInfo = newIPInfo

        // 5. 히스토리 업데이트 또는 추가
        const existingIndex = this.ipHistory.findIndex(e => e.ip === currentIP)
        if (existingIndex >= 0) {
          // 기존 항목 업데이트
          this.ipHistory[existingIndex] = {
            ip: currentIP,
            info: newIPInfo,
            lastChecked: Date.now(),
          }
        } else {
          // 새 항목 추가
          this.ipHistory.push({
            ip: currentIP,
            info: newIPInfo,
            lastChecked: Date.now(),
          })

          // 최대 10개의 IP 기록만 유지
          if (this.ipHistory.length > 10) {
            this.ipHistory = this.ipHistory.slice(-10)
          }
        }

        return newIPInfo
      } catch (error) {
        console.error('IP 정보 조회 실패:', error)
        throw error
      }
    },

    // 오래된 캐시 정리
    cleanOldCache() {
      const oneWeek = 7 * 24 * 60 * 60 * 1000
      const now = Date.now()

      this.ipHistory = this.ipHistory.filter(entry => {
        return (now - entry.lastChecked) < oneWeek
      })
    },

    clearAllCache() {
      this.currentIPInfo = null
      this.ipHistory = []
    },
  },

  persist: true,
})
