# AI Stock Research Archive 개발 로드맵

Claude가 생성한 종목 분석 리서치를 Notion에 축적하고, 동일 종목의 투자의견/목표가 변화를 시계열로 추적하는 개인 투자 학습 아카이브.

## 개요

AI Stock Research Archive는 개인 투자자·학습자를 위한 **AI 리서치 시계열 기록 플랫폼**으로 다음 기능을 제공합니다:

- **리서치 목록 및 필터링**: 최신순 카드 그리드에서 섹터/태그 기반 빠른 탐색 제공
- **리서치 상세 열람**: Notion 본문을 Markdown으로 렌더링하여 풍부한 분석 콘텐츠 표시
- **종목 시계열 추적**: 동일 종목의 투자의견·목표가 변화를 recharts 라인 차트로 시각화
- **검색 및 탐색**: 종목명/태그 키워드 기반 전체 아카이브 검색
- **Notion CMS 연동**: Claude가 생성한 리서치를 Notion에 저장하고 ISR + On-demand Revalidation으로 웹에 반영

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 기술 스택 요약

- **Framework**: Next.js 16.2.4 (App Router, Cache Components/ISR, `proxy.ts`)
- **Runtime**: TypeScript 5.x, React 19.2.4, Node.js 20+
- **Styling**: TailwindCSS v4, shadcn/ui 4.x, @hugeicons/react
- **CMS**: Notion (@notionhq/client, notion-to-md)
- **Rendering**: react-markdown, recharts (시계열 차트)
- **Form/Validation**: React Hook Form 7.x + Zod
- **Utilities**: p-limit (Notion API 동시성 제어)
- **Deployment**: Vercel, 패키지 관리 npm

## Next.js 16 주의사항 (전 Task 공통)

- `params`, `searchParams`는 **`Promise` 타입** → 모든 페이지/라우트 핸들러에서 `await` 필수
- `revalidateTag(tag, cacheLife)` — 두 번째 인자 필수 (예: `'hours'`, `'days'`)
- 설정 파일은 **`next.config.ts`** 만 허용 (`.js` 금지)
- 미들웨어는 `middleware.ts` deprecated → **`proxy.ts`** 사용
- ISR은 `export const revalidate = 3600` 방식으로 선언
- 구현 전 `node_modules/next/dist/docs/` 내 관련 가이드 확인 권장

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 구조 및 라우팅 설정** - 우선순위
  - Next.js 16 App Router 기반 전체 라우트 구조 생성 (`/`, `/research/[id]`, `/stocks/[ticker]`, `/search`, `/api/revalidate`)
  - 각 페이지의 빈 껍데기 파일 생성 (`page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
  - 공통 레이아웃 (`app/layout.tsx`) 골격 및 메타데이터/폰트 설정
  - 전역 네비게이션(헤더) 및 푸터 컴포넌트 플레이스홀더 생성
  - `next.config.ts` 기본 설정 (이미지 도메인 등 추후 확장 지점)
  - `params`/`searchParams` Promise 타입 처리 템플릿 확립

- **Task 002: 타입 정의 및 인터페이스 설계**
  - `types/research.ts` — `Research`, `StockHistory`, `Opinion`, `Currency` 타입 정의
  - `types/notion.ts` — Notion API 응답 및 Property 매퍼 입력 타입 정의
  - Notion DB 스키마 상수화 (`lib/constants/notion-schema.ts`) — Property Key 영문 고정
  - API 응답/에러 타입 정의 (`types/api.ts`)
  - Zod 스키마 선언 (`lib/schemas/research.ts`) — 런타임 검증 대비
  - 환경 변수 타입 선언 (`types/env.d.ts`) 및 `.env.example` 점검

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 라이브러리 및 디자인 시스템 구축**
  - shadcn/ui 필요 컴포넌트 설치 (Card, Badge, Input, Select, Tabs, Skeleton 등)
  - @hugeicons/react 아이콘 래퍼 및 공통 아이콘 프리셋 구축
  - 투자의견 Badge 컴포넌트 (매수/관망/매도 색상 토큰 정의)
  - 목표가 포맷터 유틸 (`formatPrice(value, currency)`) — KRW/USD 처리
  - 날짜 포맷터 유틸 (`formatDate`) 및 상대시간 유틸
  - 더미 데이터 팩토리 (`lib/mocks/research.ts`) — 20~30건 샘플 리서치 + 2~3개 종목 히스토리
  - 디자인 토큰 및 다크 모드(선택) 확인

- **Task 004: 메인 페이지 UI 완성 (카드 그리드 + 필터)**
  - 리서치 카드 컴포넌트 (`ResearchCard`) — 썸네일, 종목명, 티커, 투자의견, 목표가, 요약, 태그
  - 카드 그리드 레이아웃 (반응형 1→2→3 컬럼)
  - 섹터 필터 Select + 태그 Multi-select (클라이언트 필터링, URL searchParams 동기화)
  - 빈 상태(Empty State) 및 스켈레톤 UI
  - 더미 데이터 기반 최신순 정렬 동작 확인
  - 모바일 필터 시트(Drawer) 대응

- **Task 005: 상세/히스토리/검색 페이지 UI 완성**
  - `/research/[id]` — Notion 본문 영역 placeholder(react-markdown 목업), 헤더 메타 정보, 면책 문구 배너
  - `/stocks/[ticker]` — 종목 요약 카드 + recharts 라인 차트 스켈레톤 (더미 시계열 데이터) + 관련 리서치 타임라인
  - `/search` — 검색 인풋, 결과 리스트, 검색어 하이라이트, 최근 검색어(로컬 저장소 기반)
  - 404/에러 UI 통일 (not-found.tsx, error.tsx)
  - 반응형/접근성 점검 (키보드 네비게이션, aria-label)
  - 전체 사용자 플로우 네비게이션 검증

### Phase 3: 핵심 기능 구현

- **Task 006: Notion 클라이언트 및 데이터 매퍼 구현** - 우선순위
  - `@notionhq/client` 초기화 (`lib/notion/client.ts`) — 토큰/DB ID 환경 변수 주입
  - Notion Page → `Research` 매퍼 (`lib/notion/mappers.ts`) — 전 Property Key 영문 스키마 준수
  - 리스트 조회 함수 (`listResearches`) — 필터(status=published), 정렬(published_at desc), 페이지네이션
  - 단일 조회 함수 (`getResearchById`)
  - 티커 기반 조회 (`listResearchesByTicker`) — 히스토리 페이지용
  - **p-limit** 적용한 블록 병렬 조회 유틸 — Notion Rate Limit(초당 3req) 대응
  - 이미지 URL 만료 대응 전략: 서버 측에서 S3/Cloudinary 재업로드 또는 Next.js Image `unoptimized` + 재검증 주기 단축
  - **테스트 체크리스트** (Playwright MCP)
    - [ ] Notion 토큰 미설정 시 명확한 에러 반환
    - [ ] 잘못된 DB ID 요청 시 500 에러 대신 사용자 친화 메시지
    - [ ] 리스트 조회 응답이 `Research` 타입 스키마 준수
    - [ ] 이미지가 포함된 페이지 상세 렌더링 시 broken image 없음
    - [ ] p-limit 동시성 3 설정하에 연속 호출 throttling 확인

- **Task 007: ISR + On-demand Revalidation 및 API 라우트 구현**
  - 각 페이지에 `export const revalidate = 3600` 적용 (메인/상세/히스토리)
  - `revalidateTag('research-list', 'hours')`, `revalidateTag('research:<id>', 'hours')` — **두 번째 인자 필수**
  - `/api/revalidate` 라우트 핸들러 (`app/api/revalidate/route.ts`) — 시크릿 토큰 검증 + tag/path 선택 재검증
  - `proxy.ts` (구 middleware) — `/api/revalidate` 레이트 리밋 및 시크릿 검증 보조
  - Cache Components 태그 전략 문서화 (`docs/caching.md`)
  - **테스트 체크리스트** (Playwright MCP)
    - [ ] 유효한 토큰으로 `/api/revalidate?tag=research-list` 호출 시 200 반환
    - [ ] 잘못된 토큰 시 401 반환
    - [ ] 재검증 이후 메인 페이지 새로고침 시 갱신 데이터 표시
    - [ ] `revalidateTag` 두 번째 인자 누락 시 빌드/런타임 에러 재현 가능성 차단
    - [ ] 상세 페이지 tag 기반 부분 재검증 동작 확인

- **Task 008: Notion 본문 렌더링 (notion-to-md + react-markdown)**
  - `notion-to-md` 인스턴스 구성 및 커스텀 변환 규칙 (콜아웃, 토글, 코드블록)
  - `react-markdown` + `remark-gfm` + shiki/rehype-prism 코드 하이라이트
  - 이미지 컴포넌트 (`next/image`) 연동 — 만료 URL 대응 fallback
  - 외부 링크 안전 처리 (`target="_blank"`, `rel="noopener noreferrer"`)
  - 본문 내 TOC(선택) 및 앵커 링크
  - **테스트 체크리스트** (Playwright MCP)
    - [ ] 제목/본문/이미지/리스트/코드블록이 올바르게 렌더링
    - [ ] 이미지 로딩 실패 시 대체 UI 표시
    - [ ] 외부 링크 새 탭 및 rel 속성 확인
    - [ ] 긴 문서 스크롤 성능 이상 없음

- **Task 009: 종목 히스토리 시계열 차트 구현 (recharts)**
  - `StockHistory` 집계 로직 (`lib/aggregate/stock-history.ts`) — 동일 ticker 기준 그룹핑, published_at 정렬
  - recharts LineChart — X축: 날짜, Y축: 목표가, 툴팁: 투자의견/요약
  - 통화(Currency) 혼재 시 경고 및 기준 통화 선택 UX
  - 데이터 포인트 클릭 → 해당 리서치 상세로 이동
  - 차트 하단 리서치 타임라인(카드 리스트) 표시
  - **테스트 체크리스트** (Playwright MCP)
    - [ ] 단일 포인트 종목도 렌더링 가능
    - [ ] 포인트 클릭 시 상세 페이지 이동
    - [ ] 통화 불일치 케이스에서 경고 노출
    - [ ] 빈 히스토리 티커 접근 시 404 처리

- **Task 010: 검색 기능 구현 (클라이언트 필터 + 서버 쿼리)**
  - 검색 API 라우트(`/api/search`) — Notion query filter (title contains, tags contains)
  - 클라이언트 디바운스(300ms) + 최근 검색어(로컬 저장)
  - 검색 결과 하이라이트, 정렬 옵션(관련도/최신순)
  - 빈 결과/에러 상태 UI
  - **테스트 체크리스트** (Playwright MCP)
    - [ ] 종목명 검색 → 해당 종목 포함 결과만 노출
    - [ ] 태그 키워드 검색 → 태그 기반 필터링
    - [ ] 디바운스 동안 과도한 요청이 발생하지 않음
    - [ ] 결과 없음 상태 UI 확인

- **Task 010-1: 핵심 기능 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E (리스트 → 상세 → 히스토리 → 검색)
  - Notion API 장애 시나리오 (네트워크 에러, 429 Rate Limit) 대응 검증
  - ISR 캐시 HIT/MISS 동작 검증
  - 엣지 케이스: 필수 Property 누락 페이지, 빈 DB, 초장문 본문

### Phase 4: 고급 기능 및 최적화

- **Task 011: 법적 안전장치 및 SEO 차단**
  - 전체 페이지 공통 면책 문구 컴포넌트 (`DisclaimerBanner`) 및 상세 페이지 강조 노출
  - `app/robots.ts` — 전체 경로 `Disallow: /` (SEO 차단)
  - 각 페이지 `generateMetadata`에 `robots: { index: false, follow: false }` noindex 적용
  - `sitemap.ts` 비활성화 확인
  - Claude→Notion 저장 규칙 문서화 (`docs/notion-rules.md`) — 스키마/면책 포함 강제
  - 개인정보·외부 인용 가이드라인 정리

- **Task 012: 성능 최적화 및 Vercel 배포**
  - 번들 분석 (`@next/bundle-analyzer`) 및 불필요 의존성 제거
  - 이미지 최적화 전략 최종화 (Notion 이미지 만료 대응 포함)
  - Cache Components 태그 재정리 및 재검증 주기 튜닝
  - Vercel 프로젝트 연결 및 환경 변수 설정 (NOTION_TOKEN, NOTION_DB_ID, REVALIDATE_SECRET)
  - `proxy.ts` 레이트 리밋 최종화
  - 런타임 모니터링(Vercel Analytics/Logs) 및 에러 바운더리 점검
  - 배포 후 Production 스모크 테스트 (Playwright MCP 기반 주요 플로우 재확인)

- **Task 013: 운영 편의 기능 (선택)**
  - 관리자 전용 수동 재검증 버튼(시크릿 토큰 필요)
  - RSS 피드(개인용, `noindex` 유지) 또는 Notion 변경 이력 요약
  - Dark Mode 토글 및 사용자 프리셋 저장
  - 리서치 정합성 검증 스크립트 (필수 Property 누락 감지 CLI)
