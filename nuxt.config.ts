import type { NuxtPage } from 'nuxt/schema'
import type { PageConfig } from './shared/types/appBar'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-11',
  devtools: { enabled: true },
  runtimeConfig: {
    // https://learnnuxt.co/free/introduction/runtime-config-and-env
    //예시: NUXT_CMS_API_KEY → cmsApiKey

    // 서버 전용 - 클라이언트에 노출되지 않음
    apiSecret: '',

    // 클라이언트에서도 접근 가능
    public: {
      apiBase: '',
      cdnBase: '',
      nodeEnv: '',
      kakaoSecret: '',
      origin: '',
    },
  },

  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],

  eslint: {
    checker: true,
  },

  i18n: {
    locales: [
      { code: 'ko', language: 'ko-KR', file: 'ko.json', name: '한국어' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'ko',
    langDir: 'locales',
    detectBrowserLanguage: false,
  },

  css: [
    '~/assets/styles/index.scss', // 프론트엔드 수준 관리
  ],

  app: {
    head: {
      script: [],
    },
  },

  vite: {
    server: {
      allowedHosts: ['.ssiat.link'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'strict-unary', 'global-builtin'],
        },
      },
    },
  },

  hooks: {
    'pages:extend'(pages) {
      function setLayout(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.children) {
            setLayout(page.children)
          }
        }
      }
      setLayout(pages)

      // 경로별 타이틀과 AppBar 표시 여부 설정
      const pageConfigs: Record<string, PageConfig> = {
        '/': { title: '메인', showAppBar: true },
        '/profile': { title: '프로필', showAppBar: true },
        '/profile/edit': { title: '프로필 수정', showAppBar: true },
        // '/profile/activity': { title: '내 활동 관리', showAppBar: true },
        // '/profile/activity/comment/list': { title: '내 댓글 내역', showAppBar: true },
        // '/profile/activity/like/list': { title: '좋아요한 게시물', showAppBar: true },
        '/profile/activity/report/list': { title: '신고 내역', showAppBar: true },
        // '/profile/point/list': { title: '포인트 내역', showAppBar: true },
        '/profile/review/list': { title: '내 피드', showAppBar: true },
        '/report': { title: '신고하기', showAppBar: true },
        '/auth/signin': { title: '로그인', showAppBar: true },
        '/auth/social': { title: '간편 인증', showAppBar: true },
        '/auth/withdrawal': { title: '회원탈퇴', showAppBar: true },
        '/auth/withdrawal/complete': { title: '회원탈퇴 완료', showAppBar: true },

        '/debug': { title: '디버그', showAppBar: false },
      }

      // 필수 인증 페이지 목록
      const requiredAuthPages = ['/profile']
      // 게스트 전용 페이지 목록 (로그인 상태면 접근 불가)
      const requiredGuestPages = ['/auth/signin', '/auth/social']

      // 전체 경로 계산
      function getFullPath(page: NuxtPage, parentPath: string): string {
        if (page.path.startsWith('/')) {
          return page.path
        }
        return `${parentPath}/${page.path}`.replace(/\/+/g, '/')
      }

      // 페이지 설정 찾기
      function findConfig(path: string) {
        // 정확한 경로 매칭
        if (pageConfigs[path]) {
          return pageConfigs[path]
        }

        return null
      }

      // 페이지 설정 적용
      function applyConfig(pages: NuxtPage[], parentPath = '') {
        for (const page of pages) {
          const path = getFullPath(page, parentPath)

          page.meta ||= {}

          // 타이틀과 AppBar 설정
          const config = findConfig(path)
          if (config) {
            page.meta.title = config.title
            page.meta.showAppBar = config.showAppBar
            page.meta.pageName = config.pageName
            page.meta.isFloating = config.isFloating
            if (config.appBarStyle) {
              page.meta.appBarStyle = config.appBarStyle
            }
          }

          // 인증 미들웨어 설정
          const needsAuth = requiredAuthPages.some(
            (authPath) => path === authPath || path.startsWith(authPath + '/'),
          )

          // 게스트 전용 미들웨어 설정
          const needsGuest = requiredGuestPages.some(
            (guestPath) => path === guestPath || path.startsWith(guestPath + '/'),
          )
          if (needsGuest) {
            page.meta.middleware = ['guest']
          } else if (needsAuth) {
            // 이 코드는 페이지 내의 `definePageMeta`에서 설정한 미들웨어를 덮어쓴다는 점에 유의
            page.meta.middleware = ['auth']
          }

          // 하위 페이지 처리
          if (page.children) {
            applyConfig(page.children, path)
          }
        }
      }

      applyConfig(pages)
    },
  },
})
