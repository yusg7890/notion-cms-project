# Task 004: 메인 페이지 UI 완성 (카드 그리드 + 필터)

## 목적 및 배경

메인 페이지(`/`)에 리서치 카드 그리드와 섹터/태그 필터를 구현한다. 더미 데이터 기반으로 동작하며, URL searchParams 기반 서버 필터링과 클라이언트 FilterBar가 협력하는 패턴을 적용한다.

## 선행 조건

- Task 003 완료 (shadcn 컴포넌트, OpinionBadge, formatters, 더미 데이터 준비됨)

## 관련 파일

- `app/page.tsx` — 수정 (그리드 + 필터 연결)
- `components/research/ResearchCard.tsx` — 신규 생성
- `components/research/ResearchCardSkeleton.tsx` — 신규 생성
- `components/research/FilterBar.tsx` — 신규 생성 (`'use client'`)
- `components/research/EmptyState.tsx` — 신규 생성
- `lib/mocks/research.ts` — 참조 (더미 데이터)
- `lib/formatters.ts` — 참조 (formatPrice, formatDate)
- `components/research/OpinionBadge.tsx` — 참조

## 수락 기준

- 메인 페이지에 20건 이상의 리서치 카드 그리드 표시
- 반응형: 모바일 1열, 태블릿 2열, 데스크톱 3열
- 섹터 Select 변경 시 URL 업데이트 + 해당 섹터만 필터링
- 태그 버튼 멀티 선택 시 OR 조건 필터링
- 필터 결과 없으면 EmptyState 표시
- 카드 클릭 → `/research/[id]` 이동
- 종목명 클릭 → `/stocks/[ticker]` 이동
- TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. `components/research/ResearchCard.tsx` 생성
  - `Research` 타입 props
  - `shadcn Card` 사용, 전체 카드를 `Link href='/research/{id}'`로 래핑
  - 상단: 종목명(`font-semibold`) + 티커(`text-muted-foreground text-xs`) + `OpinionBadge`
  - 중간: `formatPrice(targetPrice, currency)` + `formatDate(publishedAt)`
  - 하단: 요약(2줄 truncate) + 태그 `Badge` 목록
  - 종목명에 `/stocks/{ticker}` Link 별도 적용(`e.stopPropagation` 처리)

- [ ] 2. `components/research/ResearchCardSkeleton.tsx` 생성
  - shadcn `Skeleton` 기반, ResearchCard와 동일한 레이아웃 구조

- [ ] 3. `components/research/FilterBar.tsx` 생성 (`'use client'`)
  - `useSearchParams`, `useRouter` 사용
  - 섹터 `Select`: `'all'` 옵션 + 더미 데이터 섹터 목록
  - 태그: 더미 데이터에서 추출한 태그를 버튼으로 멀티 선택 (OR 조건)
  - URL 업데이트: `router.push('/?sector=IT&tags=반도체,AI')` 형식
  - 필터 초기화 버튼

- [ ] 4. `components/research/EmptyState.tsx` 생성
  - "조건에 맞는 리서치가 없습니다" 메시지
  - 필터 초기화 링크

- [ ] 5. `app/page.tsx` 수정
  - `searchParams: Promise<{ sector?: string; tags?: string }>` await
  - `getMockResearches()` 호출 후 sector/tags 조건으로 서버 필터링
  - 필터링 결과를 `publishedAt` 내림차순 정렬
  - `FilterBar`에 현재 sector/tags 값 props로 전달
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` 레이아웃
  - 결과 없으면 `EmptyState` 표시

- [ ] 6. 브라우저 동작 확인
  - `npm run dev` 후 `http://localhost:3000` 접속
  - 카드 그리드, 필터, 네비게이션 동작 확인
