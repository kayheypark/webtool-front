<script setup lang="ts">
const input = ref('')
const hashes = ref({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: '',
})

const generateHashes = async () => {
  if (!input.value) {
    hashes.value = { md5: '', sha1: '', sha256: '', sha512: '' }
    return
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(input.value)

  // SHA-1
  const sha1Buffer = await crypto.subtle.digest('SHA-1', data)
  hashes.value.sha1 = Array.from(new Uint8Array(sha1Buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // SHA-256
  const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
  hashes.value.sha256 = Array.from(new Uint8Array(sha256Buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // SHA-512
  const sha512Buffer = await crypto.subtle.digest('SHA-512', data)
  hashes.value.sha512 = Array.from(new Uint8Array(sha512Buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // MD5 (simple implementation)
  hashes.value.md5 = simpleMD5(input.value)
}

// Simple MD5 implementation
const simpleMD5 = (str: string): string => {
  const rotateLeft = (lValue: number, iShiftBits: number) => {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  const addUnsigned = (lX: number, lY: number) => {
    const lX8 = lX & 0x80000000
    const lY8 = lY & 0x80000000
    const lX4 = lX & 0x40000000
    const lY4 = lY & 0x40000000
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff)
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8
    } else return lResult ^ lX8 ^ lY8
  }

  const F = (x: number, y: number, z: number) => (x & y) | (~x & z)
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z)
  const H = (x: number, y: number, z: number) => x ^ y ^ z
  const I = (x: number, y: number, z: number) => y ^ (x | ~z)

  const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  const convertToWordArray = (str: string) => {
    const lWordCount = ((str.length + 8 - ((str.length + 8) % 64)) / 64 + 1) * 16
    const lWordArray = new Array(lWordCount - 1)
    let lBytePosition = 0
    let lByteCount = 0
    while (lByteCount < str.length) {
      const lWordPosition = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordPosition] =
        lWordArray[lWordPosition] | (str.charCodeAt(lByteCount) << lBytePosition)
      lByteCount++
    }
    const lWordPosition = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordPosition] = lWordArray[lWordPosition] | (0x80 << lBytePosition)
    lWordArray[lWordCount - 2] = str.length << 3
    lWordArray[lWordCount - 1] = str.length >>> 29
    return lWordArray
  }

  const wordToHex = (lValue: number) => {
    let wordToHexValue = ''
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValue = wordToHexValue + lByte.toString(16).padStart(2, '0')
    }
    return wordToHexValue
  }

  const x = convertToWordArray(str)
  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476

  for (let k = 0; k < x.length; k += 16) {
    const AA = a
    const BB = b
    const CC = c
    const DD = d
    a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478)
    d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756)
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070db)
    b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee)
    a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf)
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a)
    c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613)
    b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501)
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8)
    d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af)
    c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1)
    b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be)
    a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122)
    d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193)
    c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e)
    b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821)
    a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562)
    d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340)
    c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51)
    b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa)
    a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d)
    d = GG(d, a, b, c, x[k + 10], 9, 0x2441453)
    c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681)
    b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8)
    a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6)
    d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6)
    c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87)
    b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed)
    a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905)
    d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8)
    c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9)
    b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a)
    a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942)
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681)
    c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122)
    b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c)
    a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44)
    d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9)
    c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60)
    b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70)
    a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6)
    d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa)
    c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085)
    b = HH(b, c, d, a, x[k + 6], 23, 0x4881d05)
    a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039)
    d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5)
    c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8)
    b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665)
    a = II(a, b, c, d, x[k + 0], 6, 0xf4292244)
    d = II(d, a, b, c, x[k + 7], 10, 0x432aff97)
    c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7)
    b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039)
    a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3)
    d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92)
    c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d)
    b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1)
    a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f)
    d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0)
    c = II(c, d, a, b, x[k + 6], 15, 0xa3014314)
    b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1)
    a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82)
    d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235)
    c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb)
    b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391)
    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
}

const { showToast } = useToast()

const copyToClipboard = async (hash: string) => {
  try {
    await navigator.clipboard.writeText(hash)
    showToast('복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

watch(input, generateHashes)

useHead({
  title: '해시 생성기 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        'MD5, SHA-1, SHA-256, SHA-512 해시를 생성하는 도구입니다. 텍스트를 입력하면 실시간으로 다양한 해시 알고리즘의 결과를 확인할 수 있습니다.',
    },
    { name: 'keywords', content: '해시생성기, MD5생성, SHA256생성, 암호화해시, 해시함수' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '해시 생성기 - 무설치 유팉리티' },
    { property: 'og:description', content: 'MD5, SHA-1, SHA-256, SHA-512 해시를 생성' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: '해시 생성기 - 무설치 유팉리티' },
    { name: 'twitter:description', content: 'MD5, SHA-1, SHA-256, SHA-512 해시를 생성' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '해시 생성기',
        description: 'MD5, SHA-1, SHA-256, SHA-512 해시를 생성하는 도구',
        applicationCategory: 'UtilityApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
      }),
    },
  ],
})
</script>

<template>
  <div>
    <div class="page-header">
      <CommonBackButton />
      <CommonShareButton />
    </div>

    <div class="header">
      <h1 class="header-title">해시 생성기</h1>
      <p class="header-description">텍스트의 해시 값을 생성하세요</p>
    </div>

    <div class="content">
      <!-- Input -->
      <div class="card">
        <label class="input-label">입력 텍스트</label>
        <textarea
          v-model="input"
          class="textarea"
          placeholder="해시를 생성할 텍스트를 입력하세요..."
          rows="6"
        />
      </div>

      <!-- Hash Results -->
      <div v-if="input" class="hash-results">
        <div class="hash-item card">
          <div class="hash-header">
            <span class="hash-name">MD5</span>
            <button class="btn-copy-small" @click="copyToClipboard(hashes.md5)">
              <Icon name="mdi:content-copy" />
            </button>
          </div>
          <code class="hash-value">{{ hashes.md5 }}</code>
        </div>

        <div class="hash-item card">
          <div class="hash-header">
            <span class="hash-name">SHA-1</span>
            <button class="btn-copy-small" @click="copyToClipboard(hashes.sha1)">
              <Icon name="mdi:content-copy" />
            </button>
          </div>
          <code class="hash-value">{{ hashes.sha1 }}</code>
        </div>

        <div class="hash-item card">
          <div class="hash-header">
            <span class="hash-name">SHA-256</span>
            <button class="btn-copy-small" @click="copyToClipboard(hashes.sha256)">
              <Icon name="mdi:content-copy" />
            </button>
          </div>
          <code class="hash-value">{{ hashes.sha256 }}</code>
        </div>

        <div class="hash-item card">
          <div class="hash-header">
            <span class="hash-name">SHA-512</span>
            <button class="btn-copy-small" @click="copyToClipboard(hashes.sha512)">
              <Icon name="mdi:content-copy" />
            </button>
          </div>
          <code class="hash-value">{{ hashes.sha512 }}</code>
        </div>
      </div>

      <!-- Info -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          해시 알고리즘 정보
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span><strong>MD5:</strong> 128비트 해시, 보안용으로는 권장되지 않음</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span><strong>SHA-1:</strong> 160비트 해시, 보안용으로는 권장되지 않음</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span><strong>SHA-256:</strong> 256비트 해시, 안전한 암호화 해시 함수</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span><strong>SHA-512:</strong> 512비트 해시, 가장 강력한 암호화 해시 함수</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 페이지 고유 스타일만 작성
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin-bottom: 12px;
}

.textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--fe-border-light);
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--fe-gray-700);
  resize: vertical;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--fe-primary);
  }

  &::placeholder {
    color: var(--fe-gray-400);
  }
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hash-item {
  padding: 20px;
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hash-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--fe-primary);
  text-transform: uppercase;
}

.hash-value {
  display: block;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  color: var(--fe-gray-700);
  background: var(--fe-gray-50);
  padding: 12px;
  border-radius: 6px;
  word-break: break-all;
  line-height: 1.6;
}

.btn-copy-small {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--fe-gray-50);
  border: none;
  border-radius: 8px;
  color: var(--fe-gray-600);
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--fe-primary);
    color: white;
  }
}

.info-section {
  margin-top: 8px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin: 0 0 20px;

  :deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--fe-primary);
  }
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--fe-gray-50);
  border-radius: 8px;
  font-size: 14px;
  color: var(--fe-gray-600);
  line-height: 1.5;

  :deep(svg) {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--fe-primary);
    margin-top: 2px;
  }

  strong {
    color: var(--fe-gray-700);
  }
}

@media (max-width: 768px) {
  .hash-value {
    font-size: 11px;
  }
}
</style>
