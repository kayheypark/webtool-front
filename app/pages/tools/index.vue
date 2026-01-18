<script setup lang="ts">
interface Tool {
  title: string
  description: string
  icon: string
  iconColor: string
  path: string
  color: string
}

const tools: Tool[] = [
  {
    title: '글자수 세기',
    description: '텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 확인',
    iconColor: '#ffffff',
    icon: 'mdi:calculator',
    path: '/tools/character-counter',
    color: '#4f46e5',
  },
  {
    title: '내 아이피',
    description: 'IP 주소와 위치 정보를 확인',
    iconColor: '#ffffff',
    icon: 'mdi:ip-network',
    path: '/tools/my-ip',
    color: '#06b6d4',
  },
  {
    title: 'UUID 생성기',
    description: '고유한 UUID를 생성하고 복사',
    iconColor: '#ffffff',
    icon: 'mdi:identifier',
    path: '/tools/uuid-generator',
    color: '#8b5cf6',
  },
  {
    title: '비밀번호 생성기',
    description: '강력한 랜덤 비밀번호를 생성',
    iconColor: '#ffffff',
    icon: 'mdi:lock-reset',
    path: '/tools/password-generator',
    color: '#ec4899',
  },
  {
    title: '해시 생성기',
    description: 'MD5, SHA-1, SHA-256, SHA-512 해시 생성',
    iconColor: '#ffffff',
    icon: 'mdi:pound',
    path: '/tools/hash-generator',
    color: '#f59e0b',
  },
  {
    title: 'QR코드 생성기',
    description: '텍스트나 URL을 QR 코드로 변환',
    iconColor: '#ffffff',
    icon: 'mdi:qrcode',
    path: '/tools/qr-generator',
    color: '#10b981',
  },
  {
    title: 'WiFi QR 생성기',
    description: 'WiFi 네트워크를 QR 코드로 공유',
    iconColor: '#ffffff',
    icon: 'mdi:wifi-cog',
    path: '/tools/wifi-qr',
    color: '#0ea5e9',
  },
]

useHead({
  title: '무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        '다양한 웹 기반 유틸리티 도구 모음. 글자수 세기, 내 아이피, UUID 생성기, 비밀번호 생성기, 해시 생성기, QR코드 생성기, WiFi QR 생성기를 무료로 이용하세요.',
    },
    { name: 'keywords', content: '웹툴, 유틸리티, 개발자도구, 온라인도구, 무료도구' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '웹툴 - 무설치 유팉리티' },
    { property: 'og:description', content: '다양한 웹 기반 유틸리티 도구 모음' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: '웹툴 - 무설치 유팉리티' },
    { name: 'twitter:description', content: '다양한 웹 기반 유틸리티 도구 모음' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '무설치 유틸리티',
        description: '다양한 웹 기반 유틸리티 도구 모음',
      }),
    },
  ],
})
</script>

<template>
  <div class="page-container">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1 class="header-title">웹툴</h1>
      </div>

      <!-- Tools Grid -->
      <div class="tools-grid">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.path"
          :to="tool.path"
          class="tool-card"
          :style="{ '--tool-color': tool.color }"
        >
          <div class="tool-icon">
            <Icon :name="tool.icon" :style="{ color: tool.iconColor }" />
          </div>
          <div class="tool-content">
            <h2 class="tool-title">{{ tool.title }}</h2>
            <p class="tool-description">{{ tool.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: var(--fe-gray-50);
  padding: 32px 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 40px;
  padding-top: 8px;
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--fe-gray-800);
  margin: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.tool-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--fe-border-light);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--tool-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.tool-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--tool-color);
  border-radius: 8px;

  :deep(svg) {
    width: 20px;
    height: 20px;
    color: white;
  }
}

.tool-content {
  flex: 1;
  min-width: 0;
}

.tool-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fe-gray-800);
  margin: 0 0 6px;
}

.tool-description {
  font-size: 14px;
  color: var(--fe-gray-500);
  margin: 0;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .page-container {
    padding: 48px 24px;
  }

  .header {
    margin-bottom: 48px;
  }

  .header-title {
    font-size: 36px;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .tool-card {
    padding: 24px;
  }

  .tool-icon {
    width: 44px;
    height: 44px;

    :deep(svg) {
      width: 22px;
      height: 22px;
    }
  }

  .tool-title {
    font-size: 17px;
  }
}

@media (min-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
