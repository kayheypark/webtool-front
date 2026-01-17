import type { PostReviewsDTO, PutReviewsDTO } from '~~/shared/types/api/review/dto'

export function createReviewFormData(dto: PostReviewsDTO): FormData {
  const formData = new FormData()
  formData.append('review', JSON.stringify(dto.review))
  dto.media?.forEach((file) => formData.append('media', file))
  return formData
}

export interface UpdateReviewFormDataParams {
  review: PutReviewsDTO['review']
  files: File[]
}

export function createUpdateReviewFormData(params: UpdateReviewFormDataParams): FormData {
  const formData = new FormData()
  formData.append('review', JSON.stringify(params.review))

  // 새로 추가된 파일들을 mediaStructure의 null 위치에 맞춰 추가
  let fileIndex = 0
  params.review.mediaStructure?.forEach((structure) => {
    if (structure.reviewMediaRowId === null && params.files[fileIndex]) {
      formData.append(`media_${structure.index}`, params.files[fileIndex])
      fileIndex++
    }
  })

  return formData
}
