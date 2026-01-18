<script setup lang="ts">
interface Comment {
  id: number
  userId: string
  nickname: string
  profileImage: string | null
  content: string
  createdAt: string
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
const comments = ref<Comment[]>([])
const loading = ref(false)

const handleDelete = (commentId: number) => {
  // TODO: API 연동
  console.log('Delete comment:', commentId)
  comments.value = comments.value.filter((c) => c.id !== commentId)
}

const handleLoadMore = () => {
  // TODO: API 연동
  console.log('Load more comments')
}

// 초기 데이터 로드
onMounted(() => {
  loading.value = true
  try {
    // TODO: API 연동
    // const data = await fetchComments(props.recordId)
    // comments.value = data
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
  <div class="comment-content">
    <div class="comment-header">
      <button type="button" class="btn-close" @click="emit('close')">
        <Icon name="mdi:close" />
      </button>
      <h3 class="title">댓글</h3>
      <span class="count">{{ totalCount }}</span>
    </div>

    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <div v-else-if="comments.length === 0" class="empty">
      <CommonNoData message="댓글이 없습니다." />
    </div>

    <div v-else class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-author">
          <div class="author-info">
            <div class="profile-image">
              <img
                v-if="comment.profileImage"
                :src="comment.profileImage"
                :alt="comment.nickname"
              />
              <Icon v-else name="mdi:account-circle" />
            </div>
            <div class="author-details">
              <span class="nickname">{{ comment.nickname }}</span>
              <span class="date">{{ formatDate(comment.createdAt) }}</span>
            </div>
          </div>
          <button type="button" class="btn-delete" @click="handleDelete(comment.id)">
            <Icon name="mdi:delete-outline" />
          </button>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
      </div>
    </div>

    <div v-if="comments.length > 0" class="comment-actions">
      <button type="button" class="btn-load-more" @click="handleLoadMore">
        더보기
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-content {
  padding: 20px;
}

.comment-header {
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

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.comment-author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 32px;
    height: 32px;
    color: #999;
  }
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nickname {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.date {
  font-size: 12px;
  color: #999;
}

.btn-delete {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #ff4444;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-actions {
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
