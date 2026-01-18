<script setup lang="ts">
const config = useRuntimeConfig()

// Production 환경에서 개발자 도구 비활성화
if (import.meta.client && config.public.nodeEnv === 'production') {
  // 컨텍스트 메뉴 비활성화
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  // 특정 키 조합 비활성화 (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }

    // Ctrl+Shift+I (개발자 도구)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }

    // Ctrl+Shift+J (콘솔)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      return false
    }

    // Ctrl+U (소스 보기)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }

    // Cmd+Option+I (Mac 개발자 도구)
    if (e.metaKey && e.altKey && e.key === 'i') {
      e.preventDefault()
      return false
    }

    // Cmd+Option+J (Mac 콘솔)
    if (e.metaKey && e.altKey && e.key === 'j') {
      e.preventDefault()
      return false
    }

    // Cmd+Option+C (Mac 요소 검사)
    if (e.metaKey && e.altKey && e.key === 'c') {
      e.preventDefault()
      return false
    }
  })

  // 개발자 도구 열림 감지 및 경고
  const devtoolsDetector = () => {
    const threshold = 160
    const widthThreshold = window.outerWidth - window.innerWidth > threshold
    const heightThreshold = window.outerHeight - window.innerHeight > threshold

    if (widthThreshold || heightThreshold) {
      // 개발자 도구가 열렸을 때 처리
      document.body.innerHTML =
        '<h1 style="text-align: center; margin-top: 50vh;">개발자 도구를 사용할 수 없습니다.</h1>'
    }
  }

  // 주기적으로 개발자 도구 열림 감지
  setInterval(devtoolsDetector, 1000)
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
