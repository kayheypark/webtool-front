<script setup lang="ts">
useHead({
  title: '씨앗의 웹툴 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content: '로그인 필요없는, 개발자와 일반 사용자를 위한 웹 기반 유틸리티 도구. 글자수 세기, UUID 생성기, 비밀번호 생성기, 해시 생성기, QR코드 생성기 등 다양한 도구를 무료로 사용하세요.',
    },
    { name: 'keywords', content: '웹툴, 유틸리티, 개발자도구, 글자수세기, UUID생성기, 비밀번호생성기, 해시생성기, QR코드생성기, 무료도구' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '씨앗의 웹툴 - 무설치 유팉리티' },
    { property: 'og:description', content: '로그인 필요없는, 개발자와 일반 사용자를 위한 웹 기반 유틸리티 도구' },
    { property: 'og:site_name', content: '씨앗의 웹툴' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '씨앗의 웹툴 - 무설치 유팉리티' },
    { name: 'twitter:description', content: '로그인 필요없는, 개발자와 일반 사용자를 위한 웹 기반 유틸리티 도구' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '씨앗의 웹툴',
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
        <h1 class="title">씨앗의 웹툴</h1>
        <p class="subtitle">로그인 필요없는, 개발자와 일반 사용자를 위한 웹 기반 유틸리티 도구</p>
        <NuxtLink to="/tools" class="cta-button">
          <Icon name="mdi:tools" />
          도구 둘러보기
        </NuxtLink>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:lightning-bolt" />
          </div>
          <h3 class="feature-title">빠르고 간편</h3>
          <p class="feature-description">별도 설치 없이 웹 브라우저에서 바로 사용</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:shield-check" />
          </div>
          <h3 class="feature-title">안전한 처리</h3>
          <p class="feature-description">모든 데이터는 브라우저 내에서만 처리</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <Icon name="mdi:devices" />
          </div>
          <h3 class="feature-title">반응형 디자인</h3>
          <p class="feature-description">PC, 태블릿, 모바일 모든 기기 지원</p>
        </div>
      </section>

      <!-- Tools Preview -->
      <section class="tools-preview">
        <h2 class="section-title">제공되는 도구</h2>
        <div class="tools-grid">
          <div class="tool-item">
            <Icon name="mdi:calculator" />
            <span>글자수 세기</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:ip-network" />
            <span>내 아이피</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:identifier" />
            <span>UUID 생성기</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:lock-reset" />
            <span>비밀번호 생성기</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:pound" />
            <span>해시 생성기</span>
          </div>
          <div class="tool-item">
            <Icon name="mdi:qrcode" />
            <span>QR코드 생성기</span>
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
