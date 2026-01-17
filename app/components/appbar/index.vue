<script setup lang="ts">
import { FULLPAGE } from '~~/shared/constants/postMessageEvent'
defineProps({
  title: {
    type: String,
    required: true,
  },
  showCloseButton: {
    type: Boolean,
    required: true,
  },
  showBackButton: {
    type: Boolean,
    required: true,
  },
  showMypageButton: {
    type: Boolean,
    required: true,
  },
  isFloating: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const handleClickClose = () => {
  usePostMessage().postMessage(FULLPAGE.CLOSE)
}
const handleClickProfile = () => {
  navigateTo('/profile')
}

const handleClickBack = () => {
  const router = useRouter()
  router.back()
}
</script>

<template>
  <header class="app-bar" :class="{ floating: isFloating }">
    <div class="app-bar-left">
      <button v-if="showBackButton" type="button" class="btn-prev" @click="handleClickBack">
        <Icon name="mdi:arrow-left" />
      </button>
    </div>
    <div class="app-bar-center">
      <strong class="title">{{ title }}</strong>
    </div>
    <div class="app-bar-right">
      <button v-if="showMypageButton" type="button" class="btn-user" @click="handleClickProfile">
        <Icon name="mdi:account" />
      </button>
      <button v-if="showCloseButton" type="button" class="btn-close" @click="handleClickClose">
        <Icon name="mdi:close" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 500;
  background-color: #ffffff;

  &.floating {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
    height: var(--fe-appbar-height);
    background-color: #ffffff;

    :deep(+ .fe-page-content) {
      .fe-bottom-action {
        position: fixed;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        max-width: 480px;
        height: 60px;
      }
    }
  }
}

.app-bar-left,
.app-bar-right {
  flex: 1;
}

.app-bar-center {
  flex: 2;
}

.app-bar-left {
  display: flex;
  justify-content: flex-start;
}

.app-bar-center {
  display: flex;
  justify-content: center;

  .title {
    font-size: 18px;
    letter-spacing: -0.02em;
  }
}

.app-bar-right {
  display: flex;
  justify-content: flex-end;
}

.back-button,
.profile-button,
.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: unset;
  color: #000;
  font-size: 28px;
  cursor: pointer;

  border: none;
}

.change.wrap header.app-bar {
  background-color: #ffffff;
}
</style>
