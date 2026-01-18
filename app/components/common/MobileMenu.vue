<script setup lang="ts">
interface MenuItem {
  title: string
  icon: string
  path: string
  children?: MenuItem[]
}

interface Props {
  menuItems: MenuItem[]
}

const props = defineProps<Props>()

const route = useRoute()
const isOpen = ref(false)
const expandedItems = ref<Set<string>>(new Set())

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    expandedItems.value.clear()
  }
}

const closeMenu = () => {
  isOpen.value = false
  expandedItems.value.clear()
}

const toggleExpand = (path: string) => {
  if (expandedItems.value.has(path)) {
    expandedItems.value.delete(path)
  } else {
    expandedItems.value.add(path)
  }
}

const isActiveRoute = (path: string) => {
  const homePaths = ['/', '/en', '/ko']
  if (homePaths.includes(path)) {
    return route.path === path
  }
  return route.path === path || route.path.startsWith(path + '/')
}

// Close menu when route changes
watch(() => route.path, () => {
  closeMenu()
})

// Prevent body scroll when menu is open
watch(isOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="mobile-menu">
    <!-- Hamburger Button -->
    <button class="hamburger-button" @click="toggleMenu" aria-label="Menu">
      <span class="hamburger-line" :class="{ open: isOpen }"></span>
      <span class="hamburger-line" :class="{ open: isOpen }"></span>
      <span class="hamburger-line" :class="{ open: isOpen }"></span>
    </button>

    <!-- Overlay -->
    <Transition name="overlay">
      <div v-if="isOpen" class="menu-overlay" @click="closeMenu"></div>
    </Transition>

    <!-- Menu Panel -->
    <Transition name="menu">
      <div v-if="isOpen" class="menu-panel">
        <div class="menu-header">
          <h2 class="menu-title">Menu</h2>
          <button class="close-button" @click="closeMenu">
            <Icon name="mdi:close" />
          </button>
        </div>

        <nav class="menu-nav">
          <template v-for="item in menuItems" :key="item.path">
            <div class="menu-section">
              <!-- Main Menu Item -->
              <div class="menu-item-wrapper">
                <NuxtLink
                  :to="item.path"
                  class="menu-item"
                  :class="{ active: isActiveRoute(item.path) }"
                  @click="!item.children && closeMenu()"
                >
                  <Icon :name="item.icon" class="menu-icon" />
                  <span class="menu-text">{{ item.title }}</span>
                </NuxtLink>

                <!-- Expand Button for Items with Children -->
                <button
                  v-if="item.children"
                  class="expand-button"
                  @click="toggleExpand(item.path)"
                >
                  <Icon
                    :name="expandedItems.has(item.path) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  />
                </button>
              </div>

              <!-- Child Menu Items -->
              <Transition name="submenu">
                <div v-if="item.children && expandedItems.has(item.path)" class="menu-children">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    class="menu-child-item"
                    :class="{ active: route.path === child.path }"
                    @click="closeMenu"
                  >
                    <Icon v-if="child.icon" :name="child.icon" class="menu-child-icon" />
                    <span class="menu-child-text">{{ child.title }}</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>
          </template>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.mobile-menu {
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
}

// Hamburger Button
.hamburger-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--fe-gray-50);
  }

  &:active {
    transform: scale(0.95);
  }
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--fe-gray-700);
  margin: 3px 0;
  transition: all 0.3s ease;
  transform-origin: center;

  &.open {
    &:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    &:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    &:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
}

// Menu Overlay
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

// Menu Panel
.menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: var(--fe-shadow-lg);
  z-index: 999;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 320px) {
    width: 240px;
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--fe-border-light);
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fe-primary);
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--fe-gray-600);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  :deep(svg) {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: var(--fe-gray-100);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Menu Navigation
.menu-nav {
  padding: 16px 0;
}

.menu-section {
  margin-bottom: 4px;
}

.menu-item-wrapper {
  display: flex;
  align-items: center;
}

.menu-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--fe-gray-700);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &:active {
    background: var(--fe-gray-100);
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

.menu-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.menu-text {
  font-size: 15px;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  color: var(--fe-gray-500);
  cursor: pointer;
  transition: all 0.2s ease;

  :deep(svg) {
    width: 20px;
    height: 20px;
  }

  &:active {
    background: var(--fe-gray-100);
  }
}

// Child Menu Items
.menu-children {
  background: var(--fe-gray-50);
  padding: 8px 0;
}

.menu-child-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 12px 48px;
  color: var(--fe-gray-600);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;

  &:active {
    background: var(--fe-gray-100);
  }

  &.active {
    background: var(--fe-primary-light);
    color: var(--fe-primary);
    font-weight: 600;
  }
}

.menu-child-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.menu-child-text {
  flex: 1;
}

// Transitions
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.menu-enter-active,
.menu-leave-active {
  transition: transform 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>