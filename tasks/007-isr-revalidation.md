# Task 007: ISR + On-demand Revalidation 및 API 라우트 구현

## 목적 및 배경

각 페이지에 ISR(Incremental Static Regeneration)을 적용하고, Notion에서 리서치를 발행하면 수동 API 호출로 캐시를 즉시 갱신할 수 있는 `/api/revalidate` 라우트를 구현한다.
Task 006 완료 후 실제 데이터를 사용하는 페이지들에 캐싱 전략을 적용한다.

## 관련 파일

- `app/page.tsx` — 수정 (revalidate 설정, Notion 데이터 연결)
- `app/expert/page.tsx` — 수정 (revalidate 설정, Notion 데이터 연결)
- `app/research/[id]/page.tsx` — 수정 (revalidate 설정, Notion 데이터 연결)
- `app/stocks/[ticker]/page.tsx` — 수정 (revalidate 설정, Notion 데이터 연결)
- `app/search/page.tsx` — 수정 (Notion 데이터 연결, 검색은 Task 010에서 고도화)
- `app/api/revalidate/route.ts` — 수정 (실제 구현으로 교체)
- `lib/constants/cache.ts` — 참조 (CACHE_TAGS)
- `lib/notion/queries.ts` — 참조 (Task 006 산출물)

## 수락 기준

- 유효한 시크릿 토큰으로 `POST /api/revalidate?secret=TOKEN` 호출 시 200 반환
- 잘못된 토큰 시 401 반환
- 메인 페이지(`/`)가 실제 Notion AI 리서치 데이터를 표시
- Expert 페이지(`/expert`)가 실제 Notion Expert 리서치 데이터를 표시
- 상세 페이지(`/research/[id]`)가 실제 Notion 리서치 데이터를 표시
- TypeScript 컴파일 오류 없음

## 구현 단계

- [x] 1. 페이지 ISR 설정 및 목 데이터 → Notion 데이터 교체
  - `app/page.tsx`: `export const revalidate = 3600`, `listResearches('ai')` 호출로 교체
  - `app/expert/page.tsx`: `export const revalidate = 3600`, `listResearches('expert')` 호출로 교체
  - `app/research/[id]/page.tsx`: `export const revalidate = 86400`, `getResearchById(id)` + `listResearchesByTicker(ticker)` 호출로 교체
  - `app/stocks/[ticker]/page.tsx`: `export const revalidate = 3600`, `listResearchesByTicker(ticker)` 호출로 교체, Research[] → StockHistory 필드 파생
  - `app/search/page.tsx`: `getAllResearches()` 호출로 교체 (클라이언트 필터링 유지)

- [x] 2. `app/api/revalidate/route.ts` 구현
  - `POST` 핸들러: `secret` searchParam 검증 (`REVALIDATE_SECRET` 환경 변수 비교)
  - 401 반환 시 `{ message: 'Invalid token' }`
  - `revalidateTag(CACHE_TAGS.RESEARCH_LIST, 'max')` 호출
  - 선택적으로 `tag` searchParam으로 특정 태그만 재검증 가능
  - 200 반환 시 `{ revalidated: true, tag: '...' }`

- [x] 3. 페이지에 cacheTag 적용 (선택)
  - 현재 단계에서는 segment revalidate만으로 충분 (skip)

- [x] 4. Notion 연동 오류 처리
  - queries.ts 각 함수가 try-catch로 에러 시 빈 배열 반환
  - 에러 바운더리(`error.tsx`) 존재 확인 완료

## 테스트 체크리스트 (Playwright MCP)

- [x] 유효한 토큰으로 `POST /api/revalidate?secret=TOKEN` 호출 시 200 반환
- [x] 잘못된 토큰으로 호출 시 401 반환
- [x] `secret` 파라미터 누락 시 401 반환
- [x] 메인 페이지에서 실제 Notion 데이터 표시 확인
- [ ] Notion API 장애 시 에러 페이지 대신 빈 목록 표시 (queries.ts try-catch로 보장, 실제 장애 시나리오 시뮬레이션 생략)

## 변경 사항 요약

- `app/api/revalidate/route.ts`: stub → 실제 구현 (secret 검증 + revalidateTag 호출)
- `app/page.tsx`, `app/expert/page.tsx`, `app/search/page.tsx`: getMockResearches → Notion queries 교체
- `app/research/[id]/page.tsx`: getMockResearchById/getMockStockHistory → getResearchById/listResearchesByTicker 교체
- `app/stocks/[ticker]/page.tsx`: getMockStockHistory → listResearchesByTicker 교체, Research[] 기반으로 StockHistory 필드 직접 파생
