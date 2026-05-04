# Task 009: 종목 히스토리 시계열 차트 구현 (실제 데이터 연결)

## 목적 및 배경

Phase 2에서 더미 데이터로 구현한 종목 히스토리 페이지와 차트를 실제 Notion 데이터와 연결한다.
`listResearchesByTicker`로 가져온 AI + Expert 통합 데이터를 집계하여 시계열 차트에 렌더링한다.
통화 혼재 경고, 단일 데이터 포인트 처리 등 엣지 케이스를 처리한다.

## 관련 파일

- `lib/aggregate/stock-history.ts` — 신규 생성 (StockHistory 집계 로직)
- `app/stocks/[ticker]/page.tsx` — 수정 (실제 데이터 연결, 집계 로직 적용)
- `components/stocks/HistoryChart.tsx` — 참조 (Phase 2에서 구현됨, 필요시 수정)
- `lib/notion/queries.ts` — 참조 (Task 006: listResearchesByTicker)

## 수락 기준

- 종목 히스토리 페이지가 실제 Notion 데이터로 렌더링
- AI Research 단일 포인트 종목도 차트 렌더링 (선 없이 점만 표시)
- Expert Research 단일 포인트 종목도 차트 렌더링
- AI + Expert 혼합 종목에서 두 라인 모두 표시
- KRW/USD 통화 혼재 시 "통화 단위가 혼재합니다" 경고 표시 (차트 숨김)
- 존재하지 않는 ticker 접근 시 404 처리
- TypeScript 컴파일 오류 없음

## 구현 단계

- [x] 1. `lib/aggregate/stock-history.ts` 생성
  - `buildStockHistory(researches: Research[]): StockHistory | null` 함수
    - 입력 배열이 비어 있으면 `null` 반환
    - `ticker`, `stockName`, `sector`는 첫 번째 Research에서 추출
    - `currency` 단일 통화 체크: 모든 Research의 currency가 동일한지 확인
    - 혼재 시 `currency` 필드를 'KRW'로 기본 설정하되 `hasCurrencyMismatch: true` 플래그 추가
    - `researches`를 `publishedAt` 오름차순 정렬 후 반환
  - `StockHistoryWithMeta` 타입: `StockHistory & { hasCurrencyMismatch: boolean }`

- [x] 2. `app/stocks/[ticker]/page.tsx` 수정
  - `listResearchesByTicker(ticker)` 호출 후 `buildStockHistory` 적용
  - 결과가 `null`이면 `notFound()` 호출
  - `hasCurrencyMismatch: true`이면 차트 위에 경고 배너 표시
  - `StockSummaryCard`, `HistoryChartLazy`, 리서치 타임라인 순서로 렌더링

- [x] 3. `components/stocks/HistoryChart.tsx` 확인 및 수정 (필요시)
  - 단일 데이터 포인트에서 에러가 없는지 확인
  - `targetPrice`가 0이거나 `expertBuyPrice`가 undefined인 경우 해당 라인 데이터셋 제거

## 테스트 체크리스트 (Playwright MCP)

- [ ] AI 단일 포인트 종목 히스토리 페이지 정상 렌더링
- [ ] Expert 단일 포인트 종목 히스토리 페이지 정상 렌더링
- [ ] 차트 데이터 포인트 클릭 시 상세 페이지 이동
- [ ] AI + Expert 혼합 종목에서 두 라인 모두 표시
- [ ] KRW/USD 혼재 종목에서 경고 메시지 표시
- [ ] 존재하지 않는 ticker 접근 시 404 페이지 표시
