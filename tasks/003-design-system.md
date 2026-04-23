# Task 003: 공통 컴포넌트 라이브러리 및 디자인 시스템 구축

## 목적 및 배경

Phase 2 UI 개발의 기반을 구축한다. shadcn/ui 컴포넌트 설치, 투자의견 Badge, 포맷터 유틸, 더미 데이터 팩토리를 준비하여 Task 004, 005에서 바로 사용할 수 있는 상태를 만든다.

## 관련 파일

- `components/ui/` — shadcn CLI로 컴포넌트 추가
- `components/research/OpinionBadge.tsx` — 신규 생성
- `lib/formatters.ts` — 신규 생성
- `lib/mocks/research.ts` — 신규 생성
- `types/research.ts` — 참조 (Research, StockHistory, Opinion, Currency)
- `lib/notion/constants.ts` — 참조 (OPINION_MAP)

## 수락 기준

- `npx shadcn@latest add card badge input select tabs skeleton sheet` 명령으로 컴포넌트가 `components/ui/`에 추가됨
- `formatPrice(75000, 'KRW')` → `'₩75,000'` 형식
- `formatPrice(195.5, 'USD')` → `'$195.50'` 형식
- `OpinionBadge`에 BUY/HOLD/SELL 전달 시 올바른 색상(green/amber/red)과 한글 텍스트(매수/관망/매도) 표시
- `getMockResearches()` 20건 이상 반환
- `getMockStockHistory('005930')`이 Research[] 포함된 StockHistory 반환
- TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. shadcn/ui 컴포넌트 설치
  - `npx shadcn@latest add card badge input select tabs skeleton sheet`
  - 설치 후 `components/ui/` 파일 목록 확인

- [ ] 2. `lib/formatters.ts` 생성
  - `formatPrice(value: number, currency: Currency): string`
    - KRW: `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })`
    - USD: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`
  - `formatDate(date: Date): string` → `'YYYY.MM.DD'` 형식
  - `formatRelativeTime(date: Date): string` → `'n일 전'` / `'n개월 전'`

- [ ] 3. `components/research/OpinionBadge.tsx` 생성
  - `Opinion` 타입 props를 받아 shadcn `Badge` 래핑
  - BUY → `bg-green-100 text-green-800 border-green-200` / `'매수'`
  - HOLD → `bg-amber-100 text-amber-800 border-amber-200` / `'관망'`
  - SELL → `bg-red-100 text-red-800 border-red-200` / `'매도'`

- [ ] 4. `lib/mocks/research.ts` 생성
  - `MOCK_RESEARCHES: Research[]` 배열 (20~30건)
  - 종목: 삼성전자(005930, IT, KRW), 애플(AAPL, IT, USD), SK하이닉스(000660, IT, KRW)
  - 각 종목 3~5건, publishedAt 1~6개월 간격, opinion 다양하게 혼합
  - `getMockResearches(): Research[]`
  - `getMockResearchById(id: string): Research | undefined`
  - `getMockStockHistory(ticker: string): StockHistory | undefined`

- [ ] 5. TypeScript 타입 검사
  - `npx tsc --noEmit` 오류 없음 확인
