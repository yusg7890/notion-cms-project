# Task 005: 상세/히스토리/검색 페이지 UI 완성

## 목적 및 배경

리서치 상세 페이지(`/research/[id]`), 종목 히스토리 페이지(`/stocks/[ticker]`), 검색 페이지(`/search`)의 UI를 완성한다. recharts(라인 차트)와 react-markdown(본문 렌더링)을 설치하고 더미 데이터 기반으로 전체 사용자 플로우가 동작하도록 한다.

## 선행 조건

- Task 003, 004 완료 (공통 컴포넌트, 메인 페이지 완성)

## 관련 파일

- `app/research/[id]/page.tsx` — 수정
- `app/research/[id]/not-found.tsx` — 신규 생성
- `app/stocks/[ticker]/page.tsx` — 수정
- `app/stocks/[ticker]/not-found.tsx` — 신규 생성
- `app/search/page.tsx` — 수정
- `components/stocks/HistoryChart.tsx` — 신규 생성 (`'use client'`)
- `components/stocks/StockSummaryCard.tsx` — 신규 생성
- `components/search/SearchInput.tsx` — 신규 생성 (`'use client'`)
- `lib/mocks/research.ts` — 참조
- `lib/formatters.ts` — 참조
- `components/research/OpinionBadge.tsx` — 참조
- `components/research/ResearchCard.tsx` — 참조

## 수락 기준

- `/research/[id]`에 종목명, 투자의견, 목표가, 발행일, AI 모델명 표시
- 존재하지 않는 id 접근 시 404 페이지 표시
- `'이 종목의 모든 리서치 보기'` 링크 클릭 시 `/stocks/[ticker]` 이동
- `/stocks/[ticker]`에 recharts LineChart 렌더링 (X축: 날짜, Y축: 목표가)
- 차트 데이터 포인트가 publishedAt 오름차순으로 표시
- 통화 혼재(KRW/USD 혼합) 종목 접근 시 경고 메시지 표시
- `/search?q=삼성` 접근 시 삼성전자 리서치 결과 표시
- 검색 결과 없을 때 EmptyState 표시
- 최근 검색어가 localStorage에 저장되고 SearchInput에 표시
- TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. 패키지 설치
  - `npm install recharts react-markdown remark-gfm`

- [ ] 2. `app/research/[id]/page.tsx` 수정
  - `getMockResearchById(id)` 호출, 없으면 `notFound()`
  - 헤더: 종목명(`h1`), 티커, 섹터 Badge, `OpinionBadge`
  - 메타: `formatPrice(targetPrice, currency)`, `formatDate(publishedAt)`, aiModel
  - 본문: 더미 마크다운 텍스트를 `react-markdown`으로 렌더링
  - 하단: `'이 종목의 모든 리서치 보기'` Link → `/stocks/{ticker}`

- [ ] 3. `app/research/[id]/not-found.tsx` 생성
  - 루트 `not-found.tsx`와 동일한 디자인, "리서치를 찾을 수 없습니다" 메시지

- [ ] 4. `components/stocks/HistoryChart.tsx` 생성 (`'use client'`)
  - recharts `LineChart` 사용
  - props: `researches: Research[]`
  - 통화 혼재 감지: researches의 currency가 2종류 이상이면 경고 UI 반환
  - X축: `publishedAt`을 `formatDate()`로 변환한 문자열
  - Y축: `targetPrice`
  - `CustomTooltip`: opinion(한글), summary 표시
  - 데이터 포인트 클릭 시 `router.push('/research/{id}')`

- [ ] 5. `components/stocks/StockSummaryCard.tsx` 생성
  - 종목명, 티커, 섹터, 총 리서치 건수 표시
  - shadcn `Card` 사용

- [ ] 6. `app/stocks/[ticker]/page.tsx` 수정
  - `getMockStockHistory(ticker)` 호출, 없으면 `notFound()`
  - `StockSummaryCard` + `HistoryChart` + 리서치 타임라인(역순 `ResearchCard`)

- [ ] 7. `app/stocks/[ticker]/not-found.tsx` 생성
  - "종목 히스토리를 찾을 수 없습니다" 메시지

- [ ] 8. `components/search/SearchInput.tsx` 생성 (`'use client'`)
  - `useSearchParams`, `useRouter` 사용
  - `onChange` → `router.push('/search?q='+value)` (디바운스 없이 직접 업데이트)
  - 최근 검색어: `localStorage` `'recent-searches'` 키, 최대 5개 저장
  - 검색어 없을 때 최근 검색어 버튼 표시

- [ ] 9. `app/search/page.tsx` 수정
  - `q` searchParams await
  - q가 있으면 `getMockResearches()`에서 `stockName`/`ticker`/`tags` 포함 여부로 필터링
  - `SearchInput` + 결과 카드 그리드 + 결과 없으면 `EmptyState`

- [ ] 10. 전체 사용자 플로우 확인
  - 메인 → 카드 클릭 → 상세 → '이 종목의 모든 리서치 보기' → 히스토리
  - 검색 입력 → 결과 → 카드 클릭 → 상세
