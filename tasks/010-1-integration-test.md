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

- [ ] AI Research 목록(`/`) 접속 → 카드 목록 표시
- [ ] 카드 클릭 → 상세 페이지(`/research/[id]`) 이동 및 본문 렌더링 확인
- [ ] 상세 페이지 → "이 종목의 모든 리서치 보기" 클릭 → 히스토리 페이지(`/stocks/[ticker]`) 이동
- [ ] 히스토리 페이지 → 차트 표시 및 타임라인 리스트 확인
- [ ] 검색 페이지(`/search`) → 키워드 입력 → 결과 표시 → 카드 클릭 → 상세 페이지 이동
- [ ] Expert Research 목록(`/expert`) → 황색 카드 표시 및 전문가 매수가 확인

### 에러 시나리오

- [ ] 존재하지 않는 ID (`/research/nonexistent-id`) 접근 → 404 페이지
- [ ] 존재하지 않는 ticker (`/stocks/INVALID`) 접근 → 404 페이지
- [ ] `/api/revalidate` 올바른 시크릿으로 호출 → 200 응답 확인
- [ ] `/api/revalidate` 잘못된 시크릿으로 호출 → 401 응답 확인

### 엣지 케이스

- [ ] 필수 Notion 프로퍼티(opinion)가 누락된 리서치가 있어도 페이지 전체가 중단되지 않음
- [ ] Expert 리서치에서 `targetPrice`가 없어도 카드 렌더링 정상
- [ ] AI 리서치에서 `expertBuyPrice`가 없어도 카드 렌더링 정상
