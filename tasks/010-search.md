# Task 010: 검색 기능 구현 (Notion 쿼리 연결)

## 목적 및 배경

검색 페이지에서 Notion API의 filter 기능을 활용하여 종목명·태그 키워드로 실제 리서치를 검색한다.
클라이언트 디바운스와 최근 검색어 저장 기능도 함께 구현한다.

## 관련 파일

- `app/api/search/route.ts` — 신규 생성 (검색 API 라우트)
- `lib/notion/queries.ts` — 수정 (searchResearches 함수 추가)
- `components/search/SearchInput.tsx` — 수정 (디바운스 + API 호출로 교체)
- `app/search/page.tsx` — 수정 (API 라우트 기반 결과 표시)

## 수락 기준

- 종목명으로 검색 시 `stock_name` 필드가 일치하는 리서치만 반환
- 태그로 검색 시 `tags` 필드가 일치하는 리서치 반환
- 검색 입력 후 300ms 내 API 요청이 발생하지 않음 (디바운스)
- 최근 검색어 최대 5개가 localStorage에 저장되고 표시
- 결과 없음 상태에서 EmptyState 컴포넌트 표시
- TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. `lib/notion/queries.ts`에 `searchResearches` 함수 추가
  - `searchResearches(query: string): Promise<Research[]>`
  - Notion filter: `{ or: [{ property: 'stock_name', rich_text: { contains: query } }, { property: 'tags', multi_select: { contains: query } }] }`
  - 추가 filter: `status = 'published'`
  - 결과를 `publishedAt` 내림차순 정렬

- [ ] 2. `app/api/search/route.ts` 생성
  - `GET` 핸들러: `q` searchParam 검증 (빈 문자열이면 빈 배열 반환)
  - `searchResearches(q)` 호출
  - 결과를 JSON으로 반환 (Research[] serialized)
  - 에러 시 500과 `{ error: '...' }` 반환

- [ ] 3. `components/search/SearchInput.tsx` 수정
  - 기존 URL searchParam 방식을 API 호출 방식으로 교체
  - `useState` + `useEffect`로 300ms 디바운스 구현
  - `fetch('/api/search?q=...')` 호출 후 결과를 부모 콜백 또는 상태로 전달
  - 최근 검색어 localStorage 저장/로드 유지

- [ ] 4. `app/search/page.tsx` 수정
  - 클라이언트 컴포넌트(`'use client'`)로 전환
  - `SearchInput`의 검색 결과 상태 관리
  - 로딩 중 스켈레톤 UI 표시
  - 결과 없음 시 `EmptyState` 표시

## 테스트 체크리스트 (Playwright MCP)

- [ ] 종목명 검색 → 해당 종목 포함 결과만 노출
- [ ] 태그 키워드 검색 → 태그 기반 필터링 결과 노출
- [ ] 입력 후 300ms 동안 API 요청 발생하지 않음 (네트워크 탭 확인)
- [ ] 검색 후 최근 검색어 목록에 추가됨
- [ ] 결과 없음 상태 UI 표시
- [ ] 빈 쿼리 요청 시 빈 배열 반환 (API)
