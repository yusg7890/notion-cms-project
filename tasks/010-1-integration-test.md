# Task 010-1: 핵심 기능 통합 테스트

## 목적 및 배경

Task 006~010 구현 완료 후 실제 Notion 연동 상태에서 전체 사용자 플로우를 검증한다.
Notion API 장애 시나리오, ISR 캐시 동작, 엣지 케이스를 체계적으로 테스트한다.

## 관련 파일

- 모든 페이지 (`app/`) — 검증 대상
- `app/api/revalidate/route.ts` — 검증 대상
- `app/api/search/route.ts` — 검증 대상

## 수락 기준

- 전체 사용자 플로우 (목록 → 상세 → 히스토리 → 검색) E2E 통과
- Notion 토큰 미설정 시 서비스 중단 대신 에러 UI 표시
- 존재하지 않는 리서치 ID 접근 시 404 표시
- 존재하지 않는 ticker 접근 시 404 표시
- `/api/revalidate` 정상 동작 확인

## 테스트 시나리오 (Playwright MCP)

### 정상 플로우

- [x] AI Research 목록(`/`) 접속 → 카드 목록 표시 (삼성전자, 목표가 ₩95,000)
- [x] 카드 클릭 → 상세 페이지(`/research/[id]`) 이동 및 본문 렌더링 확인 (종목명·티커·투자의견·목표가·발행일·AI모델·태그 모두 정상)
- [x] 상세 페이지 → "이 종목의 모든 리서치 보기 →" 클릭 → `/stocks/005930` 히스토리 페이지 이동 확인 (링크 추가로 수정)
- [x] 히스토리 페이지(`/stocks/005930`) → 차트(목표가·전문가 매수가), 투자의견 타임라인, 리서치 목록 확인
- [x] 검색 페이지(`/search`) → "삼성전자" 입력 → AI+Expert 2건 결과 → 카드 클릭 → 상세 페이지 이동
- [x] Expert Research 목록(`/expert`) → 카드 표시, 전문가 매수가(₩72,000) 확인

### 에러 시나리오

- [x] 존재하지 않는 ID (`/research/nonexistent-id`) 접근 → "리서치를 찾을 수 없습니다" 404 UI 표시
- [x] 존재하지 않는 ticker (`/stocks/INVALID`) 접근 → "종목을 찾을 수 없습니다" 404 UI 표시
- [x] `/api/revalidate` 올바른 시크릿으로 호출 → 200 `{"revalidated":true}` 응답 확인
- [x] `/api/revalidate` 잘못된 시크릿으로 호출 → 401 `{"message":"Invalid token"}` 응답 확인

### 엣지 케이스

- [x] 필수 Notion 프로퍼티(opinion) 누락 시 `parseOpinion`에서 `?? 'HOLD'` 폴백으로 페이지 중단 없음 (코드 검증)
- [x] Expert 리서치에서 `targetPrice`가 없어도 "매수가 ₩72,000"만 표시하며 정상 렌더링
- [x] AI 리서치에서 `expertBuyPrice`가 없어도 "목표가 ₩95,000"만 표시하며 정상 렌더링

## 변경 사항 요약

- Playwright MCP로 전체 E2E 테스트 완료 — 12개 시나리오 모두 통과
- `app/research/[id]/page.tsx`: "이 종목의 모든 리서치 보기 →" 링크 추가 (`/stocks/[ticker]`)
