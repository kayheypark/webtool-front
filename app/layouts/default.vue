<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

interface MenuItem {
  title: string
  icon: string
  path: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: '홈',
    icon: 'mdi:home',
    path: '/',
  },
  {
    title: '웹툴',
    icon: 'mdi:tools',
    path: '/tools',
    children: [
      { title: '글자수 세기', icon: '', path: '/tools/character-counter' },
      { title: '내 아이피', icon: '', path: '/tools/my-ip' },
      { title: 'UUID 생성기', icon: '', path: '/tools/uuid-generator' },
      { title: '비밀번호 생성기', icon: '', path: '/tools/password-generator' },
      { title: '해시 생성기', icon: '', path: '/tools/hash-generator' },
      { title: 'QR코드 생성기', icon: '', path: '/tools/qr-generator' },
    ],
  },
]

const isActiveRoute = (path: string) => {
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
        <h1 v-show="!isSidebarCollapsed" class="logo">씨앗의 웹툴</h1>
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
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
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

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--fe-bg-gradient-start) 0%, var(--fe-bg-gradient-end) 100%);
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
}

.container {
  width: 100%;
}
</style>
