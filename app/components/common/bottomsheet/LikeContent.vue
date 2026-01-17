<script setup lang="ts">
interface LikeUser {
  userId: string
  nickname: string
  profileImage: string | null
  likedAt: string
}

interface Props {
  totalCount: number
  recordId: number | string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// 실제 데이터는 API에서 가져와야 함 (임시 mock 데이터)
const likes = ref<LikeUser[]>([])
const loading = ref(false)

const handleProfile = (userId: string) => {
  // TODO: 프로필 페이지로 이동
  console.log('Go to profile:', userId)
}

const handleLoadMore = () => {
  // TODO: API 연동
  console.log('Load more likes')
}

// 초기 데이터 로드
onMounted(() => {
  loading.value = true
  try {
    // TODO: API 연동
    // const data = await fetchLikes(props.recordId)
    // likes.value = data
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}
</script>

<template>
  <div class="like-content">
    <div class="like-header">
      <button type="button" class="btn-close" @click="emit('close')">
        <Icon name="mdi:close" />
      </button>
      <h3 class="title">좋아요</h3>
      <span class="count">{{ totalCount }}</span>
    </div>

    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <div v-else-if="likes.length === 0" class="empty">
      <CommonNoData message="좋아요한 사용자가 없습니다." />
    </div>

    <div v-else class="like-list">
      <div
        v-for="like in likes"
        :key="like.userId"
        class="like-item"
        @click="handleProfile(like.userId)"
      >
        <div class="user-info">
          <div class="profile-image">
            <img v-if="like.profileImage" :src="like.profileImage" :alt="like.nickname">
            <Icon v-else name="mdi:account-circle" />
          </div>
          <div class="user-details">
            <span class="nickname">{{ like.nickname }}</span>
            <span class="date">{{ formatDate(like.likedAt) }}</span>
          </div>
        </div>
        <div class="like-icon">
          <Icon name="mdi:heart" />
        </div>
      </div>
    </div>

    <div v-if="likes.length > 0" class="like-actions">
      <button type="button" class="btn-load-more" @click="handleLoadMore">
        더보기
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.like-content {
  padding: 20px;
}

.like-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  position: relative;

  .btn-close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #000;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }

  .count {
    font-size: 14px;
    color: #666;
  }
}

.loading,
.empty {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

.like-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.like-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 40px;
    height: 40px;
    color: #999;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nickname {
  font-size: 15px;
  font-weight: 500;
  color: #000;
}

.date {
  font-size: 12px;
  color: #999;
}

.like-icon {
  flex-shrink: 0;
  color: #ff4458;

  svg {
    width: 24px;
    height: 24px;
  }
}

.like-actions {
  margin-top: 20px;
  text-align: center;
}

.btn-load-more {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
