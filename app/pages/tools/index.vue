<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface Tool {
  titleKey: string
  descriptionKey: string
  icon: string
  iconColor: string
  path: string
  color: string
}

const tools: Tool[] = [
  {
    titleKey: 'tools.characterCounter.shortTitle',
    descriptionKey: 'tools.characterCounter.description',
    iconColor: '#ffffff',
    icon: 'mdi:calculator',
    path: '/tools/character-counter',
    color: '#4f46e5',
  },
  {
    titleKey: 'tools.myIp.shortTitle',
    descriptionKey: 'tools.myIp.description',
    iconColor: '#ffffff',
    icon: 'mdi:ip-network',
    path: '/tools/my-ip',
    color: '#06b6d4',
  },
  {
    titleKey: 'tools.uuidGenerator.shortTitle',
    descriptionKey: 'tools.uuidGenerator.description',
    iconColor: '#ffffff',
    icon: 'mdi:identifier',
    path: '/tools/uuid-generator',
    color: '#8b5cf6',
  },
  {
    titleKey: 'tools.passwordGenerator.shortTitle',
    descriptionKey: 'tools.passwordGenerator.description',
    iconColor: '#ffffff',
    icon: 'mdi:lock-reset',
    path: '/tools/password-generator',
    color: '#ec4899',
  },
  {
    titleKey: 'tools.hashGenerator.shortTitle',
    descriptionKey: 'tools.hashGenerator.description',
    iconColor: '#ffffff',
    icon: 'mdi:pound',
    path: '/tools/hash-generator',
    color: '#f59e0b',
  },
  {
    titleKey: 'tools.qrGenerator.shortTitle',
    descriptionKey: 'tools.qrGenerator.description',
    iconColor: '#ffffff',
    icon: 'mdi:qrcode',
    path: '/tools/qr-generator',
    color: '#10b981',
  },
  {
    titleKey: 'tools.wifiQr.shortTitle',
    descriptionKey: 'tools.wifiQr.description',
    iconColor: '#ffffff',
    icon: 'mdi:wifi-cog',
    path: '/tools/wifi-qr',
    color: '#0ea5e9',
  },
]

useHead({
  title: t('tools.index.title'),
  meta: [
    {
      name: 'description',
      content: t('tools.index.description'),
    },
    { name: 'keywords', content: 'web tools, utilities, developer tools, online tools, free tools' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.index.title')} - ${t('common.title')}` },
    { property: 'og:description', content: t('tools.index.description') },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.index.title')} - ${t('common.title')}` },
    { name: 'twitter:description', content: t('tools.index.description') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t('common.title'),
        description: t('tools.index.description'),
      }),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="header">
      <h1 class="header-title">{{ $t('tools.index.title') }}</h1>
    </div>

    <!-- Tools Grid -->
    <div class="tools-grid">
      <NuxtLink
        v-for="tool in tools"
        :key="tool.path"
        :to="localePath(tool.path)"
        class="tool-card"
        :style="{ '--tool-color': tool.color }"
      >
        <div class="tool-icon">
          <Icon :name="tool.icon" :style="{ color: tool.iconColor }" />
        </div>
        <div class="tool-content">
          <h2 class="tool-title">{{ $t(tool.titleKey) }}</h2>
          <p class="tool-description">{{ $t(tool.descriptionKey) }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
