import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthProvider } from '~~/shared/types'

export const useAuthStore = defineStore(
  'ssiat-front:auth',
  () => {
    const loggedIn: Ref<boolean> = ref(false)
    const expiresAt: Ref<number | null> = ref(null)
    const phoneNumber: Ref<string | null> = ref(null)
    const acctRowId: Ref<number | null> = ref(null)
    const authProvider: Ref<AuthProvider | null> = ref(null) //이 계정이 어느 플랫폼으로부터 인증되었는지

    const nickname: Ref<string | null> = ref(null)
    const profileImage: Ref<string | null> = ref(null)
    const userStatusCode: Ref<string | null> = ref(null)
    const socialTypeCode: Ref<string | null> = ref(null)
    const userRowId: Ref<number | null> = ref(null)
    const userId: Ref<string | null> = ref(null)

    return {
      loggedIn,
      expiresAt,
      phoneNumber,
      acctRowId,
      authProvider,

      nickname,
      profileImage,
      userStatusCode,
      socialTypeCode,
      userRowId,
      userId,
    }
  },
  {
    persist: true,
  },
)
