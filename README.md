# 씨앗링크 (Ssiat Link) - 웹툴 모음

간단하고 유용한 웹툴을 제공하는 프론트엔드 서비스입니다.

## 제공하는 웹툴

- 글자수 세기

## 개발 환경 세팅

```bash
npm i
npm run dev
```

## 배포

### Development
```bash
npm run deploy:dev
# 또는
npm run builddeploy:dev
```

### Staging
```bash
npm run deploy:staging
# 또는
npm run builddeploy:staging
```

### Production
```bash
npm run deploy:prod
# 또는
npm run builddeploy:prod
```

## 기술 스택

- Nuxt 3
- Vue 3
- SCSS
- TypeScript

## 프로젝트 구조

```
app/
├── assets/        # 스타일 파일
├── layouts/       # 레이아웃
├── pages/         # 페이지 (각 웹툴)
└── app.vue        # 루트 컴포넌트
```
