<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('common.title'),
  meta: [
    {
      name: 'description',
      content: t('common.description'),
    },
    {
      name: 'keywords',
      content:
        '웹툴, 유틸리티, 개발자도구, 글자수세기, UUID생성기, 비밀번호생성기, 해시생성기, QR코드생성기, WiFi QR생성기, 무료도구',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('common.title') },
    {
      property: 'og:description',
      content: t('common.description'),
    },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('common.title') },
    {
      name: 'twitter:description',
      content: t('common.description'),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '무설치 유틸리티',
        description: '로그인 필요없는, 개발자와 일반 사용자를 위한 웹 기반 유틸리티 도구',
        applicationCategory: 'UtilityApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
        featureList: [
          '글자수 세기',
          '내 아이피 확인',
          'UUID 생성기',
          '비밀번호 생성기',
          '해시 생성기',
          'QR코드 생성기',
          'WiFi QR 생성기',
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="home-container">
    <div class="content">
      <!-- Hero Section -->
      <section class="hero">
        <h1 class="title">{{ $t('home.title') }}</h1>
        <p class="subtitle">{{ $t('home.subtitle') }}</p>
        <NuxtLink to="/tools" class="cta-button">
          <Icon name="mdi:tools" />
          {{ $t('nav.tools') }}
        </NuxtLink>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:lightning-bolt" />
          </div>
          <h3 class="feature-title">{{ $t('home.features.fast.title') }}</h3>
          <p class="feature-description">{{ $t('home.features.fast.description') }}</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:shield-check" />
          </div>
          <h3 class="feature-title">{{ $t('home.features.secure.title') }}</h3>
          <p class="feature-description">{{ $t('home.features.secure.description') }}</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:devices" />
          </div>
          <h3 class="feature-title">{{ $t('home.features.responsive.title') }}</h3>
          <p class="feature-description">{{ $t('home.features.responsive.description') }}</p>
        </div>
      </section>

      <!-- Tools Preview -->
      <section class="tools-preview">
        <h2 class="section-title">{{ $t('home.toolsTitle') }}</h2>
        <div class="tools-grid">
          <div class="tool-item">
            <Icon name="mdi:calculator" />
            <span>{{ $t('tools.characterCounter.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:ip-network" />
            <span>{{ $t('tools.myIp.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:identifier" />
            <span>{{ $t('tools.uuidGenerator.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:lock-reset" />
            <span>{{ $t('tools.passwordGenerator.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:pound" />
            <span>{{ $t('tools.hashGenerator.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:qrcode" />
            <span>{{ $t('tools.qrGenerator.shortTitle') }}</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:wifi-cog" />
            <span>{{ $t('tools.wifiQr.shortTitle') }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--fe-bg-gradient-start) 0%,
    var(--fe-bg-gradient-end) 100%
  );
}

.content {
  width: 100%;
  padding: 60px 20px;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
}

.hero {
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
}

.title {
  font-size: 56px;
  font-weight: 700;
  color: var(--fe-gray-700);
  margin: 0 0 20px;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
}

.subtitle {
  font-size: 20px;
  color: var(--fe-gray-500);
  margin: 0 0 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--fe-primary);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--fe-shadow-sm);

  :deep(svg) {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--fe-primary-hover);
    box-shadow: var(--fe-shadow-md);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 80px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 60px;
  }
}

.feature-card {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--fe-shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--fe-shadow-md);
  }
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--fe-primary-light);
  border-radius: 16px;
  margin-bottom: 20px;

  :deep(svg) {
    width: 32px;
    height: 32px;
    color: var(--fe-primary);
  }
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin: 0 0 12px;
}

.feature-description {
  font-size: 15px;
  color: var(--fe-gray-500);
  margin: 0;
  line-height: 1.6;
}

.tools-preview {
  text-align: center;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--fe-gray-700);
  margin: 0 0 40px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 32px;
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--fe-gray-600);
  box-shadow: var(--fe-shadow-sm);
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
    color: var(--fe-primary);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--fe-shadow-md);
    color: var(--fe-primary);
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
