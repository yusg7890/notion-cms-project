# AI Stock Research Archive — Development Guidelines

## Project Overview

- **목적**: Claude가 생성한 종목 분석 리서치를 Notion에 축적하고 시계열로 추적하는 개인 투자 학습 아카이브
- **스택**: Next.js 16.2.4 (App Router) · TypeScript 5.x · React 19.2.4 · TailwindCSS v4 · shadcn/ui 4.x · @hugeicons/react · @notionhq/client · notion-to-md · react-markdown · recharts · p-limit · React Hook Form + Zod
- **데이터 소스**: Notion DB 단일 소스 (별도 DB 없음)
- **배포**: Vercel

---

## Project Architecture

```
/
├── app/                        # Next.js App Router 페이지
│   ├── layout.tsx              # 전역 레이아웃 (noindex 메타, 폰트)
│   ├── page.tsx                # 메인 페이지 (F001 카드 그리드, F002 필터)
│   ├── robots.ts               # robots.txt 생성 (SEO 차단)
│   ├── research/[id]/          # 리서치 상세 페이지 (F004)
│   ├── stocks/[ticker]/        # 종목 히스토리 페이지 (F005)
│   ├── search/                 # 검색 페이지 (F003)
│   └── api/
│       ├── revalidate/         # On-demand Revalidation (F007)
│       └── search/             # 검색 API 라우트
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트 (CLI로만 추가)
│   ├── research/               # 리서치 도메인 컴포넌트 (ResearchCard 등)
│   ├── stocks/                 # 종목 도메인 컴포넌트 (HistoryChart 등)
│   └── common/                 # 공통 컴포넌트 (DisclaimerBanner, Header, Footer)
├── lib/
│   ├── notion/
│   │   ├── client.ts           # @notionhq/client 초기화
│   │   ├── mappers.ts          # Notion Page → Research 타입 변환
│   │   ├── constants.ts        # OPINION_MAP, STATUS, CURRENCY 상수
│   │   └── build-helpers.ts    # p-limit 적용 generateStaticParams 헬퍼
│   ├── aggregate/
│   │   └── stock-history.ts    # ticker 기준 StockHistory 집계
│   ├── mocks/
│   │   └── research.ts         # 더미 데이터 팩토리 (UI 개발용)
│   ├── schemas/
│   │   └── research.ts         # Zod 스키마 (런타임 검증)
│   └── utils.ts                # cn() 유틸 (기존 파일)
├── types/
│   ├── research.ts             # Research, StockHistory, Opinion, Currency
│   ├── notion.ts               # Notion API 응답 타입
│   └── api.ts                  # API 응답/에러 타입
├── docs/
│   ├── PRD.md                  # 기능 명세 (읽기 전용)
│   └── ROADMAP.md              # 개발 로드맵 (Task 완료 시 ✅ 업데이트)
├── tasks/                      # Task 파일 디렉토리 (XXX-description.md)
├── next.config.ts              # Next.js 설정 (TS 전용)
├── proxy.ts                    # 미들웨어 대체 (middleware.ts 금지)
└── shrimp-rules.md             # 이 파일
```

---

## Next.js 16 필수 패턴 (Breaking Changes)

### async params / searchParams

- **모든** 페이지에서 `params`와 `searchParams`는 `Promise` 타입 — 반드시 `await` 사용

```typescript
// ✅ 올바른 패턴
export default async function ResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// ❌ 금지 — 동기 접근 불가
export default async function ResearchPage({ params }: { params: { id: string } }) {
  const { id } = params // 런타임 에러
}
```

### revalidateTag 두 번째 인자 필수

```typescript
// ✅ 올바른 패턴
revalidateTag('research-list', 'hours')
revalidateTag('research-detail', 'max')

// ❌ 금지 — 두 번째 인자 누락
revalidateTag('research-list')
```

### 설정 파일

- `next.config.ts` 만 허용
- `next.config.js` **절대 생성 금지**

### 미들웨어

- `middleware.ts` **사용 금지** (deprecated)
- 미들웨어 로직은 `proxy.ts` 에 작성

### ISR 선언 방식

```typescript
// 각 페이지 파일 상단에 선언
export const revalidate = 3600  // 메인·히스토리 페이지
export const revalidate = 86400 // 상세 페이지
```

---

## Notion 연동 규칙

### Property Key 대소문자·띄어쓰기 정확히 일치 필수

| Property Key | 타입 | 주의 |
|---|---|---|
| `title` | Title | 기본 Title 속성 |
| `stock_name` | Rich Text | 히스토리 추적 키 — 오타 금지 |
| `ticker` | Rich Text | |
| `sector` | Select | |
| `tags` | Multi-select | |
| `opinion` | Select | `매수` / `관망` / `매도` 중 하나 |
| `target_price` | Number | 숫자만, 통화 별도 |
| `currency` | Select | `KRW` / `USD` 중 하나 |
| `summary` | Rich Text | |
| `published_at` | Date | ISO 8601 |
| `status` | Select | `draft` / `published` 중 하나 |
| `ai_model` | Rich Text | |

### 상수 파일 (`lib/notion/constants.ts`) 수정 규칙

- `OPINION_MAP`, `STATUS`, `CURRENCY` 상수를 변경할 때 Notion DB 옵션도 동시에 변경
- Notion DB 옵션 추가/변경 없이 코드만 수정 금지

### Notion API Rate Limit 대응

- 빌드 시 `generateStaticParams` 에서 **반드시** `p-limit(3)` 적용
- 런타임 요청은 ISR 캐시로 최소화

### 이미지 처리

- Notion 이미지 URL은 ~1시간 후 만료 (서명 URL)
- MVP: 리서치 본문에 이미지 삽입 자제 (텍스트/표 위주)
- `next.config.ts` 의 `remotePatterns` 에 Notion 도메인 이미 등록됨 — 추가 도메인 필요 시 이 파일만 수정

---

## 캐싱 전략

### 태그 네이밍

```typescript
// 리스트 캐시 태그
'research-list'

// 개별 리서치 캐시 태그
`research:${id}`

// 종목 히스토리 캐시 태그
`stock:${ticker}`
```

### On-demand Revalidation API (`app/api/revalidate/route.ts`)

- `REVALIDATE_SECRET` 환경 변수로 인증
- POST 요청만 허용
- `revalidateTag` 두 번째 인자 항상 포함

---

## UI/스타일링 규칙

### TailwindCSS v4

- 별도 `tailwind.config.*` 파일 **생성 금지** (v4는 CSS 파일에서 직접 설정)
- `postcss.config.mjs` 는 기존 파일 유지
- `app/globals.css` 에 CSS 변수 및 커스텀 토큰 추가

### shadcn/ui 컴포넌트 추가

- 반드시 CLI 명령어로 추가: `npx shadcn@latest add <component>`
- `components/ui/` 에 직접 파일 생성 금지
- `components.json` 설정 파일 임의 수정 금지

### 아이콘

- `@hugeicons/react` 사용 (`@hugeicons/core-free-icons` 패키지와 함께)
- 다른 아이콘 라이브러리 추가 금지

### 투자의견 색상 토큰 (일관성 필수)

| 의견 | 색상 |
|---|---|
| 매수 (BUY) | green 계열 |
| 관망 (HOLD) | yellow/amber 계열 |
| 매도 (SELL) | red 계열 |

---

## 법적 안전장치 (F011) — 절대 제거 금지

- `app/layout.tsx` 의 `robots: { index: false, follow: false }` 메타데이터 유지
- `app/robots.ts` 의 `Disallow: /` 기본값 유지 (`NEXT_PUBLIC_SITE_INDEXABLE` 환경 변수로만 변경)
- **모든** 페이지(메인·상세·히스토리·검색)에 `DisclaimerBanner` 컴포넌트 하단 표시 필수
- 면책 문구 텍스트: "본 사이트는 AI(Claude)가 생성한 개인 학습·기록 목적의 아카이브입니다. 투자 권유, 투자 자문, 유사투자자문에 해당하지 않으며, 게시된 내용은 투자 의사결정의 근거로 사용할 수 없습니다. 투자 결과에 대한 책임은 전적으로 투자자 본인에게 있습니다."

---

## 환경 변수

| 변수 | 설명 | 필수 |
|---|---|---|
| `NOTION_TOKEN` | Notion API 통합 토큰 | ✅ |
| `NOTION_DB_ID` | 리서치 Notion DB ID | ✅ |
| `REVALIDATE_SECRET` | On-demand Revalidation 시크릿 | ✅ |
| `NEXT_PUBLIC_SITE_INDEXABLE` | 검색엔진 색인 허용 여부 (기본 `false`) | - |

- 환경 변수 추가 시 `.env.example` 도 동시에 업데이트

---

## 파일 동시 수정 규칙

| 이 파일을 수정하면 | 이 파일도 함께 수정 |
|---|---|
| `lib/notion/constants.ts` (옵션 변경) | Notion DB 속성 옵션 + `types/research.ts` |
| `types/research.ts` (타입 변경) | `lib/schemas/research.ts` (Zod 스키마) |
| `next.config.ts` (remotePatterns 추가) | 해당 없음 |
| 새 환경 변수 추가 | `.env.example` |
| `docs/ROADMAP.md` Task 완료 | Task 파일 내 체크박스 업데이트 |
| 새 페이지 추가 | `DisclaimerBanner` 푸터 필수 포함 |

---

## Task 작업 규칙

- Task 파일 위치: `/tasks/XXX-description.md` (예: `001-setup.md`)
- Task 완료 시 `docs/ROADMAP.md` 에서 해당 Task를 ✅ 로 표시
- API/비즈니스 로직 Task는 "테스트 체크리스트" 섹션 필수 포함
- 현재 Task 순서: ROADMAP.md Phase 1 → Phase 2 → Phase 3 → Phase 4

---

## 코드 스타일

- 들여쓰기: 스페이스 2칸
- 문자열: 작은따옴표(`''`) 사용
- 변수명: camelCase
- 함수명: 동사 시작 (`getUserData`, `handleClick`, `fetchResearches`)
- 함수 30줄 이하 유지
- 매직 넘버 금지 — 상수로 정의
- `console.log` 금지 — 적절한 로깅 방식 사용
- 주석: 한국어, WHY가 명확할 때만 작성

---

## 금지 사항

- `middleware.ts` 파일 생성 금지
- `next.config.js` 생성 금지 (`next.config.ts` 만 허용)
- `components/ui/` 에 직접 컴포넌트 파일 생성 금지 (shadcn CLI 사용)
- Notion Property Key 오타·대소문자 오류 — `lib/notion/constants.ts` 기준으로만 참조
- `revalidateTag` 두 번째 인자 누락 금지
- 모든 페이지에서 `params`/`searchParams` 동기 접근 금지
- `DisclaimerBanner` 없는 페이지 배포 금지
- `app/robots.ts` 의 기본 `Disallow: /` 하드코딩 제거 금지
- `tailwind.config.*` 파일 생성 금지 (TailwindCSS v4)
- `@notionhq/client` 외 비공식 Notion 클라이언트 사용 금지 (`react-notion-x` 등)
- 이미지 없이 코드 리뷰 없이 `node_modules/next/dist/docs/` 가이드 미확인 후 Next.js API 사용 금지
