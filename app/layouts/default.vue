<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

interface MenuItem {
  title: string
  icon: string
  path: string
  children?: MenuItem[]
}

const { t } = useI18n()
const localePath = useLocalePath()

const menuItems = computed<MenuItem[]>(() => [
  {
    title: t('nav.home'),
    icon: 'mdi:home',
    path: localePath('/'),
  },
  {
    title: t('nav.utilities'),
    icon: 'mdi:tools',
    path: localePath('/tools'),
    children: [
      {
        title: t('tools.characterCounter.shortTitle'),
        icon: '',
        path: localePath('/tools/character-counter'),
      },
      { title: t('tools.myIp.shortTitle'), icon: '', path: localePath('/tools/my-ip') },
      {
        title: t('tools.uuidGenerator.shortTitle'),
        icon: '',
        path: localePath('/tools/uuid-generator'),
      },
      {
        title: t('tools.passwordGenerator.shortTitle'),
        icon: '',
        path: localePath('/tools/password-generator'),
      },
      {
        title: t('tools.hashGenerator.shortTitle'),
        icon: '',
        path: localePath('/tools/hash-generator'),
      },
      {
        title: t('tools.qrGenerator.shortTitle'),
        icon: '',
        path: localePath('/tools/qr-generator'),
      },
      { title: t('tools.wifiQr.shortTitle'), icon: '', path: localePath('/tools/wifi-qr') },
      {
        title: t('tools.signatureGenerator.shortTitle'),
        icon: '',
        path: localePath('/tools/signature-generator'),
      },
    ],
  },
])

const isActiveRoute = (path: string) => {
  // localePath로 변환된 경로들을 고려
  const homePaths = ['/', '/en', '/ko']

  // Home 경로인 경우 정확히 일치할 때만 active
  if (homePaths.includes(path)) {
    return route.path === path
  }

  // 다른 경로는 정확히 일치하거나 하위 경로일 때 active
  return route.path === path || route.path.startsWith(path + '/')
}

// 사이드바 접기/펴기 상태
const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<template>
  <div class="desktop-layout">
    <div v-if="config.public.nodeEnv !== 'production'" class="fe-debug-env">
      {{ config.public.nodeEnv }}
    </div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="sidebar-header">
        <h1 v-show="!isSidebarCollapsed" class="logo">ssiat.link</h1>
        <button class="toggle-button" @click="toggleSidebar">
          <Icon :name="isSidebarCollapsed ? 'mdi:arrow-right' : 'mdi:arrow-left'" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <template v-for="item in menuItems" :key="item.path">
          <div class="nav-section">
            <NuxtLink
              :to="item.path"
              class="nav-item"
              :class="{ active: isActiveRoute(item.path) }"
            >
              <Icon :name="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.title }}</span>
            </NuxtLink>

            <div v-if="item.children && isActiveRoute(item.path)" class="nav-children">
              <NuxtLink
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="nav-child-item"
                :class="{ active: route.path === child.path }"
              >
                <Icon v-if="child.icon" :name="child.icon" class="nav-child-icon" />
                <span class="nav-child-text">{{ child.title }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <!-- 언어 선택 버튼 (사이드바 하단) -->
      <div class="sidebar-footer" :class="{ collapsed: isSidebarCollapsed }">
        <CommonLanguageSelector :collapsed="isSidebarCollapsed" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <div class="mobile-header-left">
          <CommonMobileMenu :menu-items="menuItems" />
          <h1 class="mobile-logo">ssiat.link</h1>
        </div>
        <CommonLanguageSelector />
      </div>

      <div class="page-container">
        <div class="container">
          <slot />
        </div>
      </div>
    </main>

    <CommonModal />
    <CommonBottomSheet />
    <CommonToast />
  </div>
</template>

<style scoped lang="scss">
.desktop-layout {
  display: flex;
  min-height: 100vh;
  background: var(--fe-bg-gradient-start);
}

.fe-debug-env {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background-color: #e53935;
  border-radius: 0 0 4px 0;
  opacity: 0.8;

  display: none;
}

.sidebar {
  width: 180px;
  background: white;
  border-right: 1px solid var(--fe-border-light);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease;

  &.collapsed {
    width: 70px;
    overflow: visible; // 드롭다운이 보이도록 변경

    .nav-text,
    .nav-child-text {
      display: none;
    }

    .nav-children {
      display: none;
    }

    .nav-item,
    .nav-child-item {
      justify-content: center;
      padding: 12px;
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--fe-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--fe-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease;
}

.toggle-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--fe-gray-600);
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--fe-gray-100);
    color: var(--fe-primary);
  }

  &:active {
    transform: scale(0.95);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--fe-border-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;

  &.collapsed {
    padding: 12px 8px;
    overflow: visible;
  }
}

.nav-section {
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--fe-gray-700);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: var(--fe-gray-50);
    color: var(--fe-primary);
  }

  &.active {
    background: var(--fe-primary-light);
    color: var(--fe-primary);
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--fe-primary);
    }
  }
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 15px;
}

.nav-children {
  padding-left: 16px;
  margin-top: 4px;
}

.nav-child-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: var(--fe-gray-600);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 12px;

  &:hover {
    background: var(--fe-gray-50);
    color: var(--fe-primary);
  }

  &.active {
    background: var(--fe-primary-light);
    color: var(--fe-primary);
    font-weight: 600;
  }
}

.nav-child-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nav-child-text {
  flex: 1;
}

.main-content {
  flex: 1;
  margin-left: 180px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  &.sidebar-collapsed {
    margin-left: 70px;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
  }
}

.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid var(--fe-border-light);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 1024px) {
    display: flex;
  }
}

.mobile-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--fe-primary);
  margin: 0;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--fe-bg-gradient-start) 0%,
    var(--fe-bg-gradient-end) 100%
  );
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
}

.container {
  width: 100%;
}
</style>
