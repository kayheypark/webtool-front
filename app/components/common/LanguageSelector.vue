<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const { currentLocale, availableLocales, changeLocale, currentLocaleLabel } = useI18nHelper()

const showDropdown = ref(false)
const dropdownPosition = ref<'bottom' | 'top'>('bottom')
const dropdownRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()

const handleLocaleChange = (locale: string) => {
  changeLocale(locale)
  showDropdown.value = false
}

// 드롭다운 위치 좌표
const dropdownStyle = ref<{ top?: string; left?: string; bottom?: string }>({})

// 드롭다운 위치 계산
const calculateDropdownPosition = () => {
  if (!buttonRef.value) return

  const buttonRect = buttonRef.value.getBoundingClientRect()
  const dropdownHeight = 150 // 예상 드롭다운 높이
  const spaceBelow = window.innerHeight - buttonRect.bottom
  const spaceAbove = buttonRect.top

  // collapsed 상태일 때는 fixed position 사용
  if (props.collapsed) {
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      // 위로 표시
      dropdownPosition.value = 'top'
      dropdownStyle.value = {
        bottom: `${window.innerHeight - buttonRect.top}px`,
        left: `${buttonRect.right + 8}px`,
      }
    } else {
      // 아래로 표시
      dropdownPosition.value = 'bottom'
      dropdownStyle.value = {
        top: `${buttonRect.bottom + 8}px`,
        left: `${buttonRect.right + 8}px`,
      }
    }
  } else {
    // 기본 상태는 절대 위치 사용
    dropdownPosition.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
    dropdownStyle.value = {}
  }
}

const toggleDropdown = () => {
  if (!showDropdown.value) {
    calculateDropdownPosition()
  }
  showDropdown.value = !showDropdown.value
}

// 드롭다운 외부 클릭 감지
const dropdown = ref<HTMLElement>()
onClickOutside(dropdown, () => {
  showDropdown.value = false
})

// 윈도우 리사이즈 시 드롭다운 위치 재계산
onMounted(() => {
  window.addEventListener('resize', calculateDropdownPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateDropdownPosition)
})
</script>

<template>
  <div ref="dropdown" class="language-selector" :class="{ collapsed: props.collapsed }">
    <button ref="buttonRef" class="language-button" :class="{ collapsed: props.collapsed }" @click="toggleDropdown">
      <Icon name="mdi:translate" />
      <span v-if="!props.collapsed" class="locale-label">{{ currentLocaleLabel }}</span>
      <Icon v-if="!props.collapsed" :name="showDropdown ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="chevron" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        ref="dropdownRef"
        class="language-dropdown"
        :class="{ 'dropdown-top': dropdownPosition === 'top', 'dropdown-collapsed': props.collapsed }"
        :style="props.collapsed ? dropdownStyle : {}"
      >
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          class="locale-option"
          :class="{ active: locale.code === currentLocale }"
          @click="handleLocaleChange(locale.code)"
        >
          <span class="locale-name">{{ locale.name }}</span>
          <Icon v-if="locale.code === currentLocale" name="mdi:check" class="check-icon" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.language-selector {
  position: relative;

  &.collapsed {
    .language-button {
      padding: 10px;
      justify-content: center;
      width: 100%;
    }
  }
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  color: var(--fe-gray-700);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--fe-gray-50);
    border-color: var(--fe-primary);
  }

  &:active {
    transform: scale(0.98);
  }

  &.collapsed {
    width: 44px;
    padding: 12px;
  }

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  .chevron {
    width: 16px;
    height: 16px;
    color: var(--fe-gray-500);
  }
}

.locale-label {
  min-width: 60px;
  text-align: left;
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 150px;
  background: white;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  box-shadow: var(--fe-shadow-md);
  z-index: 1000;
  overflow: hidden;

  &.dropdown-top {
    top: auto;
    bottom: calc(100% + 8px);
  }

  &.dropdown-collapsed {
    position: fixed !important;
    z-index: 10000;
  }
}

.locale-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--fe-gray-700);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--fe-gray-50);
  }

  &.active {
    background: var(--fe-primary-light);
    color: var(--fe-primary);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--fe-gray-100);
  }
}

.locale-name {
  flex: 1;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: var(--fe-primary);
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .language-button {
    padding: 8px 12px;
    font-size: 13px;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }

  .locale-label {
    min-width: 50px;
  }

  .locale-option {
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
