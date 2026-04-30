# AI Stock Research Archive MVP PRD

## 핵심 정보

**목적**: 전문가 전략가의 종목 추천(Strategist Research)과 Claude가 생성한 AI 종목 분석(AI Research)을 Notion에 축적하고, 동일 종목의 투자의견·전문가 매수가·목표가 변화를 시계열로 추적한다. **Strategist Research가 주된 사용 케이스**로, 전문가 매수가를 메인 지표로 아카이빙한다.
**사용자**: 프로젝트 소유자 1인 — 주요 증권사/전략가의 종목 추천을 직접 입력하거나 Claude로 AI 분석을 요청하고, 그 결과를 개인 투자 학습 기록으로 보관한다.

---

## 사용자 스토리

### Strategist Research 작성자 관점 (주된 사용 케이스)

- "주요 증권사 전략가의 종목 추천을 Notion DB에 입력하면, 전문가 매수가와 투자의견이 웹 아카이브에 자동 반영되길 원한다."
- "동일 종목에 대한 여러 시점의 전문가 매수가 추이를 시계열 차트로 비교하고 싶다."
- "전문가 의견과 AI 분석을 동일 차트에서 나란히 확인하고 싶다."

### AI 분석 요청자 (보조 사용 케이스)

- "삼성전자를 Claude에 분석 요청하면, 투자의견·목표가·분석 근거가 포함된 리서치가 Notion DB에 자동 저장되고 싶다."
- "Notion에서 초안을 검토한 뒤 상태를 '발행'으로 바꾸면 즉시 웹에 노출되길 원한다."
- "6개월 전 분석과 오늘 분석이 나란히 보여, 내 투자 시각이 어떻게 달라졌는지 확인하고 싶다."

### 리서치 열람자 (웹 방문자) 관점

- "발행된 리서치를 최신순 카드 목록으로 빠르게 훑어볼 수 있어야 한다."
- "관심 종목명이나 태그로 원하는 리서치를 즉시 찾고 싶다."
- "특정 종목 페이지에서 목표가/투자의견 변화 추이를 차트와 표로 한눈에 파악하고 싶다."

---

## 사용자 여정

### Strategist Research 여정 (주된 사용 케이스)

```
1. [Notion DB - 직접 입력]
   사용자 → 전문가 종목 추천 정보를 Notion DB에 수동 입력 (source: 'strategist')
   status 속성 → 'published' 로 변경
   수동으로 POST /api/revalidate 호출
   ↓

2. [웹 - Strategist Research 페이지]
   /strategist — 전문가 매수가 중심 카드 그리드
   ↓
   [필터: 섹터 / 태그 선택]
   ↓

3. 분기점
   A. 카드 클릭 → [상세 페이지] → 전문가 매수가·투자의견 + 목표가 추이 차트
   B. 검색창 입력 → [검색 페이지] → AI + Strategist 통합 검색 결과
```

### AI Research 여정 (보조 사용 케이스)

```
1. [Claude Desktop / Claude.ai]
   사용자 → "삼성전자 분석해줘"
   Claude가 종목 분석 수행 후 Notion MCP로 리서치 페이지 생성 (상태: 초안)
   ↓

2. [Notion DB]
   사용자가 내용 검토 후 status 속성 → 'published' 로 변경
   수동으로 POST /api/revalidate 호출 (또는 북마클릿)
   ↓

3. [웹 - AI Research 페이지]
   / — AI 목표가 중심 카드 그리드
   ↓
   [필터: 섹터 / 태그 선택]  OR  [검색: 종목명·태그 입력]
   ↓

4. 분기점
   A. 카드 클릭 → [상세 페이지] → Notion 본문 렌더링 + 목표가 추이 차트
   B. 검색창 입력 → [검색 페이지] → AI + Strategist 통합 검색 결과

5. [상세 페이지]
   본문 읽기 완료 → 종목 히스토리 링크로 이동 가능
```

---

## 기능 명세

### 1. MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|--------------|------------|
| **F001** | 리서치 목록 조회 | 발행 상태 리서치를 최신순 카드 그리드로 표시 | 서비스의 진입점이자 핵심 열람 화면 | 메인 페이지 |
| **F002** | 섹터/태그 필터 | 선택된 섹터·태그로 카드 목록을 클라이언트 측 필터링 | 리서치가 쌓일수록 분류 탐색이 필수 | 메인 페이지 |
| **F003** | 리서치 검색 | 종목명·태그 키워드로 리서치 검색 | 원하는 종목을 빠르게 찾는 핵심 진입로 | 검색 페이지 |
| **F004** | 리서치 상세 열람 | Notion 페이지 본문을 웹에서 렌더링 | 분석 내용 열람이 서비스의 핵심 가치 | 상세 페이지 |
| **F005** | 종목 히스토리 조회 | 동일 종목 리서치를 시계열로 나열 + 목표가/투자의견 변화 차트 | 시계열 추적이 이 프로젝트의 차별 가치 | 종목 히스토리 페이지 |
| **F006** | Notion 연동 (읽기) | Notion API로 발행 상태 리서치 데이터 조회 및 Cache Components 캐싱 | Notion이 유일한 데이터 소스 | 전체 페이지 (서버 레이어) |
| **F007** | On-demand Revalidation | 수동 API 호출로 캐시 즉시 갱신 | 발행 후 즉시 반영을 위한 최소 운영 도구 | 전체 페이지 (서버 레이어) |
| **F008** | Strategist Research 목록 | 전문가 매수가 중심 리서치를 최신순 카드 그리드로 표시 (`/strategist`) | Strategist Research가 주된 사용 케이스 — 별도 진입점 필요 | Strategist Research 페이지 |

### 2. MVP 필수 지원 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|--------------|------------|
| **F010** | Claude → Notion 저장 규칙 | 투자의견(매수/관망/매도), 목표가, 통화(KRW/USD), AI 모델명, 발행일 등 스키마 준수 | Claude가 올바른 형식으로 저장해야 웹이 정상 동작 | 없음 (운영 규칙) |
| **F011** | 면책 문구 + SEO 차단 | 모든 페이지 하단 면책 문구 + noindex 메타태그 + robots.txt Disallow | 공개 시 유사투자자문업 법적 리스크 방지 | 메인 페이지, 상세 페이지, 종목 히스토리 페이지, 검색 페이지 |

### 3. MVP 이후 기능 (제외)

- 사용자 인증 / 댓글 시스템
- 실시간 주가 API 연동 (Yahoo Finance, KRX 등)
- Claude 분석 서버 자동 호출 (스케줄링)
- 외부 재무 데이터 / 뉴스 데이터 주입
- 관리자 UI (발행 상태 변경을 웹에서 처리)
- Notion Automation 웹훅 연동 (Zapier/Make 중계 필요, v2로 이연)
- 다국어 지원 / 설정·알림·소셜 기능

---

## 메뉴 구조

```
Research Archive 내비게이션

왼쪽 사이드바 (전체 공개, sticky)
├── [사이트 제목] Research Archive → / 이동
├── AI Research (/) - F001, F002           ← 보라색(violet) 카드 그리드
├── Strategist Research (/strategist) - F008  ← 황색(amber) 카드 그리드
└── 검색 (/search) - F003

페이지 내 이동
├── AI Research 카드 클릭 → 상세 페이지 - F004
├── Strategist Research 카드 클릭 → 상세 페이지 - F004
├── 상세 페이지 내 "이 종목의 모든 리서치 보기" → 종목 히스토리 페이지 - F005
└── 종목 히스토리 페이지 내 각 리서치 → 상세 페이지 - F004

공통 (모든 페이지 하단)
└── 면책 문구 + noindex 설정 - F011
```

---

## 페이지별 상세 기능

### AI Research 페이지 (`/`)

> **구현 기능:** `F001`, `F002`, `F011` | **접근:** 사이드바 AI Research 버튼 또는 루트 경로

| 항목 | 내용 |
|------|------|
| **역할** | Claude가 생성한 AI 분석 리서치의 진입점. 최신 AI 분석을 보라색(violet) 카드 그리드로 한눈에 파악 |
| **진입 경로** | 사이드바 AI Research 버튼 클릭, 사이트 루트 접근, 다른 페이지에서 사이트 제목 클릭 |
| **사용자 행동** | 카드 목록을 훑어보고 관심 리서치를 클릭하거나, 섹터·태그 필터로 범위를 좁혀 탐색 |
| **주요 기능** | • AI 분석 리서치 카드 그리드 (소스 레이블 "AI 분석", 종목명, 투자의견 배지, 목표가+통화단위, 발행일, 요약 표시)<br>• 섹터 필터 드롭다운 (클라이언트 필터링)<br>• 태그 멀티 필터 (클라이언트 필터링, 다중 선택 시 OR 조건)<br>• 페이지네이션 (페이지당 20건, Notion API cursor 기반)<br>• 면책 문구 푸터<br>• **리서치 카드 클릭** → 상세 페이지 이동 |
| **카드 스타일** | 보라색(violet) 그라데이션 배경, 보라색 테두리, "AI 분석" 소스 레이블 |
| **다음 이동** | 카드 클릭 → 상세 페이지 / 검색창 입력 → 검색 페이지 |

---

### Strategist Research 페이지 (`/strategist`)

> **구현 기능:** `F008`, `F002`, `F011` | **접근:** 사이드바 Strategist Research 버튼

| 항목 | 내용 |
|------|------|
| **역할** | 전문가 전략가의 종목 추천 리서치의 진입점. 전문가 매수가 중심 황색(amber) 카드 그리드. **사이트의 주된 사용 케이스** |
| **진입 경로** | 사이드바 Strategist Research 버튼 클릭 |
| **사용자 행동** | 전문가 매수가를 중심으로 카드 목록을 확인하거나, 섹터·태그 필터로 범위를 좁혀 탐색 |
| **주요 기능** | • Strategist 리서치 카드 그리드 (소스 레이블 "전문가 의견", 종목명, 투자의견 배지, **전문가 매수가**+통화단위, 발행일, 요약 표시)<br>• 섹터 필터 드롭다운 (클라이언트 필터링)<br>• 태그 멀티 필터 (클라이언트 필터링, 다중 선택 시 OR 조건)<br>• 면책 문구 푸터<br>• **리서치 카드 클릭** → 상세 페이지 이동 |
| **카드 스타일** | 황색(amber) 그라데이션 배경, 황색 테두리, "전문가 의견" 소스 레이블 |
| **다음 이동** | 카드 클릭 → 상세 페이지 / 검색창 입력 → 검색 페이지 |

---

### 상세 페이지

> **구현 기능:** `F004`, `F011` | **인증:** 없음 (전체 공개)

| 항목 | 내용 |
|------|------|
| **역할** | 개별 리서치의 Notion 본문을 완전히 렌더링. 종목 히스토리로의 연결 허브 |
| **진입 경로** | 메인 페이지 카드 클릭, 종목 히스토리 페이지 리서치 항목 클릭, 검색 결과 클릭 |
| **사용자 행동** | 본문 전체 읽기, 투자의견·목표가·AI 모델 메타 확인, 동일 종목 이전 리서치로 이동 |
| **주요 기능** | • 메타 헤더 (종목명, 티커, 섹터, 태그, 투자의견 배지, 목표가+통화단위, 발행일, AI 모델명)<br>• Notion 본문 렌더링 (notion-to-md + react-markdown)<br>• "이 종목의 모든 리서치 보기" 링크 (종목 히스토리 페이지로)<br>• 이전/다음 리서치 네비게이션 (publishedAt 기준)<br>• 면책 문구 푸터 |
| **다음 이동** | "모든 리서치 보기" 클릭 → 종목 히스토리 페이지 / 헤더 홈 → 메인 페이지 |

---

### 종목 히스토리 페이지

> **구현 기능:** `F005`, `F011` | **인증:** 없음 (전체 공개)

| 항목 | 내용 |
|------|------|
| **역할** | 동일 종목의 모든 리서치(AI + Strategist 통합)를 시계열로 보여주고, 목표가·전문가 매수가·투자의견 변화를 시각화. 프로젝트의 차별 핵심 화면 |
| **진입 경로** | 상세 페이지 "이 종목의 모든 리서치 보기" 링크, 직접 URL 접근 |
| **사용자 행동** | 목표가/매수가 추이 차트 확인, 투자의견 변화 타임라인 확인, 각 시점 분석 요약 비교, 특정 시점 상세 페이지로 이동 |
| **주요 기능** | • 종목 기본 정보 헤더 (종목명, 티커, 섹터)<br>• 목표가(AI) + 전문가 매수가(Strategist) 통합 line chart (Chart.js, x축: publishedAt, y축: 가격, 단일 통화만 렌더링 — 혼재 시 경고 메시지)<br>• 현재 페이지 데이터 포인트에 "현재 페이지" 레이블 박스 + 화살표 표시 (source별 해당 라인 추적)<br>• 투자의견 변화 타임라인 (날짜별 매수/관망/매도 배지)<br>• 리서치 시계열 목록 (날짜, 소스, 투자의견, 가격+통화단위, 요약, 상세 링크)<br>• 차트 데이터 접근성용 `<table>` 병기<br>• 면책 문구 푸터 |
| **다음 이동** | 리서치 항목 클릭 → 상세 페이지 |

---

### 검색 페이지

> **구현 기능:** `F003`, `F011` | **인증:** 없음 (전체 공개)

| 항목 | 내용 |
|------|------|
| **역할** | 종목명 또는 태그 키워드로 리서치를 즉시 탐색 |
| **진입 경로** | 헤더 검색 메뉴 클릭, 메인 페이지 검색창에서 Enter |
| **사용자 행동** | 키워드 입력 → 클라이언트 필터 기반으로 결과 확인 (종목명·태그 대상) → 원하는 리서치 클릭 |
| **주요 기능** | • 키워드 검색 입력 필드 (종목명, 태그 대상, 본문 텍스트 검색은 MVP 제외)<br>• 검색 결과 카드 목록 (메인 페이지 카드와 동일 형식)<br>• 검색 결과 없음 상태 처리 (빈 결과 안내 문구)<br>• 면책 문구 푸터<br>• **검색 결과 카드 클릭** → 상세 페이지 이동 |
| **다음 이동** | 카드 클릭 → 상세 페이지 / 종목명 클릭 → 종목 히스토리 페이지 |

---

## Notion 연동 플로우

### 데이터 흐름

```
Claude (Notion MCP)
  → Notion DB 페이지 생성 (status: 'draft')
  → 사용자 검토 후 status → 'published' 로 변경

Next.js 16 서버
  → Notion API 쿼리 (filter: status = 'published', sort: published_at 내림차순)
  → Cache Components ("use cache" + cacheLife 프로파일) 또는 route segment revalidate
  → On-demand Revalidation: POST /api/revalidate?secret=[TOKEN]
     (발행 상태 변경 후 수동 호출 — 북마클릿 또는 간이 관리 페이지)
```

### ISR 전략 (Next.js 16 기준)

Next.js 16에서는 암묵적 캐싱이 제거되었습니다. 아래 두 가지 방식 중 하나를 선택합니다.

**방식 A — route segment `revalidate` (간단, MVP 권장)**

```typescript
// app/page.tsx, app/stocks/[ticker]/page.tsx 등
export const revalidate = 3600; // 초 단위
```

**방식 B — Cache Components (Next.js 16 권장 패턴)**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    cacheComponents: true, // PPR 제거 후 대체 플래그
  },
};
```

```typescript
'use cache';
import { cacheLife } from 'next/cache';

export async function fetchResearches() {
  cacheLife('hours'); // 또는 'max', 'days' 등 프로파일
  // Notion API 호출
}
```

**On-demand Revalidation — 새 시그니처 필수 적용**

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
  // Next.js 16: revalidateTag 두 번째 인자 필수
  revalidateTag('research-list', 'max');
  revalidateTag('research-detail', 'max');
  return Response.json({ revalidated: true });
}
```

| 구분 | 전략 | 비고 |
|------|------|------|
| 메인 페이지 | revalidate: 3600 (1시간) | 자주 발행하지 않으므로 기본 1시간 |
| 상세 페이지 | revalidate: 86400 (24시간) | 기발행 본문은 잘 바뀌지 않음 |
| 종목 히스토리 | revalidate: 3600 (1시간) | 새 리서치 추가 시 반영 필요 |
| On-demand | 즉시 | 발행 후 수동 /api/revalidate 호출로 override |

### Next.js 16 필수 패턴

**async params / searchParams (Breaking Change)**

```typescript
// app/research/[id]/page.tsx
export default async function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 동기 접근 불가 — await 필수
  // ...
}

// app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams; // await 필수
  // ...
}
```

**설정 파일은 반드시 TypeScript**

```
next.config.ts  (next.config.js 사용 금지)
```

**middleware 대신 proxy (필요 시)**

```
proxy.ts  (middleware.ts deprecated)
```

### Notion API Rate Limit 대응

- 기본 limit: 평균 3 requests/second, 초과 시 HTTP 429 + `Retry-After` 헤더
- ISR/Cache Components 캐싱으로 런타임 반복 요청 최소화
- `@notionhq/client`의 자동 재시도 옵션 활용 (`timeoutMs: 60000`)
- **빌드 시 `generateStaticParams` 동시성 제한 필수**: `p-limit` 라이브러리로 concurrency를 3으로 제한

```typescript
// lib/notion/build-helpers.ts
import pLimit from 'p-limit';

const limit = pLimit(3); // Notion rate limit 준수

export async function generateResearchStaticParams() {
  const ids = await getAllPublishedIds();
  return ids.map((id) => limit(() => ({ id })));
}
```

### Notion 이미지 URL 만료 대응

- Notion 이미지 URL은 약 1시간 후 만료 (`secure.notion-static.com` 서명 URL)
- **MVP 운영 규칙**: 리서치 본문에 이미지 삽입 자제 (텍스트/표 위주)
- 장기적으로 `/api/image-proxy` 라우트를 통해 Cloudflare R2 등에 캐싱하는 방식 검토

---

## Claude → Notion 저장 규칙 (F010)

Claude가 Notion MCP로 리서치를 저장할 때 반드시 준수해야 할 규칙입니다.

> **주의**: Notion MCP가 Select/Multi-select/Number/Date 등 모든 속성을 한 번에 정확히 세팅하는지 **반드시 실제 MCP 설치 후 smoke test 선행** 필요. 속성이 누락 또는 잘못 저장된 경우 웹 빌드가 깨질 수 있습니다.

### Notion DB Property Key (영문 고정)

Notion DB 컬럼명을 아래 영문 key로 생성합니다. 코드에서 `@notionhq/client` 응답을 파싱할 때 이 key를 직접 참조하므로 **대소문자·띄어쓰기 포함 정확히 일치**해야 합니다.

| Property Key (Notion 컬럼명) | 타입 | 설명 |
|------------------------------|------|------|
| `title` | Title | 리서치 제목 (기본 Title 속성) |
| `stock_name` | Rich Text | 종목명 (히스토리 추적 키, 일관성 필수) |
| `ticker` | Rich Text | 종목 코드 (예: `005930`, `AAPL`) |
| `sector` | Select | 산업 섹터 |
| `tags` | Multi-select | 분류 태그 |
| `opinion` | Select | 투자의견 — 옵션: `매수` / `관망` / `매도` |
| `target_price` | Number | AI 목표가 (숫자만, 통화는 currency 필드 참조) — AI Research 전용 |
| `expert_buy_price` | Number | 전문가 매수가 (숫자만) — Strategist Research 전용 |
| `currency` | Select | 통화 단위 — 옵션: `KRW` / `USD` |
| `source` | Select | 리서치 소스 — 옵션: `ai` / `strategist` |
| `summary` | Rich Text | 한 줄 요약 (50자 이내) |
| `published_at` | Date | 분석 수행 날짜 (ISO 8601) |
| `status` | Select | 상태 — 옵션: `draft` / `published` |
| `ai_model` | Rich Text | AI 모델명 (예: `Claude Opus 4.7`) 또는 증권사명 (예: `삼성증권`) |

### Select 옵션 상수 정의 (코드 내 매핑 테이블)

```typescript
// lib/notion/constants.ts

/** Notion DB의 opinion Select 옵션값 (한글) → 코드 내부 enum 매핑 */
export const OPINION_MAP = {
  '매수': 'BUY',
  '관망': 'HOLD',
  '매도': 'SELL',
} as const;

export type OpinionLabel = keyof typeof OPINION_MAP;
export type OpinionCode = (typeof OPINION_MAP)[OpinionLabel];

/** status Select 옵션값 (영문 소문자 고정) */
export const STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

/** currency Select 옵션값 */
export const CURRENCY = {
  KRW: 'KRW',
  USD: 'USD',
} as const;
```

### 필수 필드 저장 규칙

| 필드 | 저장 규칙 |
|------|----------|
| title | `[종목명] 리서치 - YYYY-MM-DD` 형식 권장 |
| stock_name | 정확한 공식 종목명 (히스토리 추적 키, 일관성 필수) |
| ticker | 국내: 6자리 숫자, 해외: 알파벳 티커 (예: `005930`, `AAPL`) — 표기 일관성 필수 |
| opinion | `매수` / `관망` / `매도` 중 정확히 하나 |
| target_price | AI Research 전용 — 숫자만 (통화 단위는 currency 필드에 별도 저장). Strategist는 비워둠 |
| expert_buy_price | Strategist Research 전용 — 전문가 매수가 숫자만. AI Research는 비워둠 |
| source | `ai` (Claude 생성) 또는 `strategist` (전문가 의견) 중 하나 — 반드시 지정 |
| currency | `KRW` 또는 `USD` |
| summary | 50자 이내 한 줄 요약 |
| published_at | 분석 수행 날짜 (ISO 8601 형식) |
| status | 반드시 `draft` 로 저장 (발행은 사용자가 직접 변경) |
| ai_model | AI Research: 사용한 Claude 모델명 (예: `Claude Opus 4.7`) / Strategist: 증권사명 (예: `삼성증권`) |

### 본문 필수 포함 사항

1. **목표가 산정 근거**: 사용한 밸류에이션 방법(PER, PBR, DCF 등)과 적용 수치를 명시
2. **분석 시점 명시**: 분석에 사용한 데이터의 기준 날짜 (예: "2026년 1분기 실적 기준")
3. **불확실성 언급**: AI 분석의 한계와 데이터 부재 항목을 명시
4. **면책 문구**: 본문 하단에 "본 분석은 AI가 생성한 개인 학습 기록이며, 투자 권유가 아닙니다." 포함
5. **블록 수 제한 준수**: Notion API 페이로드 제한 (블록 1,000개, 텍스트 2,000자) 초과 금지

---

## 데이터 모델

Notion DB가 단일 데이터 소스이므로 별도 DB는 없음. 아래는 Notion DB 스키마를 코드에서 매핑하는 타입 정의 기준입니다.

### Research (Notion 페이지 매핑)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | Notion 페이지 ID | string (UUID) |
| title | 리서치 제목 | string |
| stockName | 종목명 (히스토리 추적 키) | string |
| ticker | 종목 코드 | string |
| sector | 산업 섹터 | string |
| tags | 분류 태그 | string[] |
| opinion | 투자의견 (코드 내부 enum) | 'BUY' \| 'HOLD' \| 'SELL' |
| targetPrice | 목표가 (AI Research 주지표) | number |
| expertBuyPrice | 전문가 매수가 (Strategist Research 주지표) | number \| null |
| currency | 통화 단위 | 'KRW' \| 'USD' |
| summary | 한 줄 요약 | string |
| publishedAt | 발행일 | Date |
| status | 상태 | 'draft' \| 'published' |
| aiModel | 사용 AI 모델명 (AI Research) / 증권사명 (Strategist) | string |
| source | 리서치 소스 구분 | 'ai' \| 'strategist' |

### StockHistory (클라이언트 집계용 파생 타입)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| ticker | 종목 코드 | string |
| stockName | 종목명 | string |
| sector | 섹터 | string |
| currency | 통화 단위 (단일 통화만 허용, 혼재 시 차트 렌더링 불가) | 'KRW' \| 'USD' |
| researches | 해당 종목 리서치 목록 (publishedAt 오름차순) | Research[] |

---

## 기술 스택

### 프론트엔드 프레임워크

- **Next.js 16.2.4** (App Router) — 실제 설치 버전. ISR / on-demand revalidation / Cache Components 지원
  - `next.config.ts` 사용 (`.js` 금지)
  - `params`, `searchParams`는 모두 `Promise` 타입 — `await` 필수
  - `revalidateTag(tag, cacheLife)` — 두 번째 인자 필수
  - PPR(`experimental.ppr`) 제거 → `experimental.cacheComponents: true` 사용
  - `middleware.ts` deprecated → `proxy.ts` 사용
- **TypeScript 5.x** — 타입 안전성
- **React 19.2.4** — 실제 설치 버전

### 스타일링 & UI

- **TailwindCSS v4** — 설정 파일 없는 새로운 CSS 엔진 (실제 설치 버전)
- **shadcn/ui 4.x** — 카드, 배지, 드롭다운 등 컴포넌트 (실제 설치 버전)
- **@hugeicons/react** — 아이콘 (실제 설치 버전)

### Notion 연동

- **@notionhq/client** — 공식 Notion API 클라이언트 (단일 공식 토큰)
- **notion-to-md** — Notion 본문을 Markdown으로 변환 (1순위, `@notionhq/client` 단일 토큰으로 동작)
- **react-markdown** — Markdown을 React로 렌더링

> react-notion-x는 비공식 Notion API(`token_v2`) 토큰을 별도로 요구하므로 MVP에서는 제외합니다.

### 차트

- **Recharts** — 목표가 변화 line chart (React 기반, Client Component로 래핑 필수)

### 동시성 제어

- **p-limit** — 빌드 시 `generateStaticParams` Notion API 동시 요청을 3으로 제한

### 폼 & 검증

- **React Hook Form 7.x** + **Zod** — 검색 폼 검증 및 Notion API 응답 스키마 검증

### 배포 & 호스팅

- **Vercel** — Next.js 16 최적화, ISR 및 on-demand revalidation 네이티브 지원

### 패키지 관리

- **npm** — 의존성 관리

---

## 3일 스프린트 MVP 계획

| 일차 | 작업 항목 | 완료 기준 |
|------|----------|----------|
| **Day 1** | Notion DB 설계 (property key 영문 고정) + `@notionhq/client` 연동 + Notion mapper 작성 (`lib/notion/mapper.ts`) + 메인 페이지 카드 그리드 + 상세 페이지 (notion-to-md 렌더링) | 로컬에서 발행 리서치가 메인/상세 페이지에 표시됨 |
| **Day 2** | 종목 히스토리 페이지 + recharts line chart + 투자의견 타임라인 + currency 혼재 경고 | 단일 종목의 목표가 추이 차트가 정상 동작 |
| **Day 3** | 검색 페이지 + On-demand revalidation (`/api/revalidate`) + 면책 문구 컴포넌트 + `noindex` 메타태그 + `app/robots.ts` + Vercel 배포 + smoke test | Vercel URL에서 전체 플로우 동작 확인 |

---

## 예상 리스크 및 대응 방안

### 1. Next.js 16 Breaking Changes 적용 오류

- **리스크**: async params/searchParams, revalidateTag 새 시그니처, next.config.ts 미적용으로 빌드 실패
- **대응**:
  - 코딩 전 `node_modules/next/dist/docs/` 가이드 반드시 참조 (AGENTS.md 지침)
  - `await params`, `await searchParams` 패턴을 모든 페이지에 일관 적용
  - `revalidateTag('tag', 'max')` 두 번째 인자 누락 시 lint 경고 설정

### 2. Notion MCP DB 속성 세팅 불일치

- **리스크**: Claude가 MCP로 페이지 생성 시 Select/Multi-select/Number 속성이 잘못 저장되어 웹 빌드 또는 필터가 깨짐
- **대응**:
  - **개발 착수 전 MCP smoke test 필수**: Claude에게 테스트 리서치 1건을 저장하게 한 후 Notion에서 모든 속성값이 올바르게 저장되었는지 확인
  - `lib/notion/mapper.ts`에서 Zod 스키마로 Notion 응답 파싱 — 필수 필드 누락 시 빌드 경고 또는 에러 throw
  - `docs/claude-prompt.md`에 Claude 시스템 프롬프트 및 속성 저장 규칙 별도 문서화

### 3. AI 할루시네이션 (목표가/재무 수치 오류)

- **리스크**: Claude가 존재하지 않는 재무 수치를 생성하거나 목표가 계산을 잘못할 수 있음
- **대응**:
  - 본문에 분석 기준 날짜 및 데이터 출처 명시를 저장 규칙으로 강제
  - 발행 전 사용자가 Notion에서 반드시 검토 (draft → published 단계 유지)
  - 목표가 산정 근거 섹션을 본문에 필수 포함

### 4. Notion API Rate Limit

- **리스크**: 빌드 시 `generateStaticParams` 다수 페이지 동시 생성으로 3 req/s 초과
- **대응**:
  - `p-limit(3)`으로 동시성 3으로 고정
  - Cache Components/ISR로 런타임 트래픽 대부분 캐시 처리
  - `@notionhq/client` 자동 재시도 + `Retry-After` 헤더 준수

### 5. Notion 이미지 URL 만료

- **리스크**: 서명 URL 약 1시간 후 만료
- **대응**: MVP에서 리서치 본문 이미지 삽입 자제 (텍스트/표 위주) — F010 저장 규칙에 명시

### 6. 법적 리스크 (유사투자자문업)

- **리스크**: 공개 웹에 배포 시 자본시장법상 유사투자자문업으로 오해받을 수 있음
- **대응** (면책 문구 단독으로는 불충분 — 아래 조합 필수 적용):
  - **noindex 메타태그**: 모든 페이지에 `<meta name="robots" content="noindex, nofollow" />` 기본 적용
  - **robots.txt**: `app/robots.ts`에서 `Disallow: /` 기본값 설정
  - **면책 문구**: 모든 페이지 하단 F011 컴포넌트 필수 표시
    > "본 사이트는 AI(Claude)가 생성한 개인 학습·기록 목적의 아카이브입니다. 투자 권유, 투자 자문, 유사투자자문에 해당하지 않으며, 게시된 내용은 투자 의사결정의 근거로 사용할 수 없습니다. 투자 결과에 대한 책임은 전적으로 투자자 본인에게 있습니다."
  - **환경 변수 토글**: `NEXT_PUBLIC_SITE_INDEXABLE=false`를 기본값으로 설정하여 추후 공개 여부 전환 가능하게 설계

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true';
  return {
    rules: {
      userAgent: '*',
      disallow: isIndexable ? [] : ['/'],
    },
  };
}
```

---

## MVP vs 확장 기능 구분

| 구분 | 기능 |
|------|------|
| **MVP** | 메인 카드 그리드, 섹터/태그 필터, 검색, 상세 본문 렌더링 (notion-to-md), 종목 히스토리 + 목표가 차트 (currency 단위 포함), Cache Components/ISR + on-demand revalidation (수동), 면책 문구 + noindex + robots.txt |
| **확장 v1** | 실시간 주가 API 연동 (목표가 대비 현재가 표시), 재무 데이터 자동 주입 (Claude 분석 보조), 이미지 프록시 라우트 |
| **확장 v2** | Claude 분석 자동 스케줄링 (정기 업데이트), 뉴스 데이터 컨텍스트 주입, Notion Automation 웹훅 (Zapier/Make 중계) |
| **확장 v3** | 관리자 UI (발행 상태 웹에서 관리), 사용자 인증, 북마크 |
