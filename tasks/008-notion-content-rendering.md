# Task 008: Notion 본문 렌더링 (notion-to-md + react-markdown)

## 목적 및 배경

상세 페이지(`/research/[id]`)에서 Notion 페이지의 실제 본문을 Markdown으로 변환하여 렌더링한다.
`notion-to-md`로 Notion 블록을 Markdown 문자열로 변환하고, `react-markdown`으로 HTML로 렌더링한다.

## 관련 파일

- `lib/notion/content.ts` — 신규 생성 (notion-to-md 변환 함수)
- `components/research/MarkdownRenderer.tsx` — 신규 생성 (react-markdown 렌더러)
- `app/research/[id]/page.tsx` — 수정 (본문 렌더링 연결)
- `lib/notion/client.ts` — 참조 (Task 006 산출물)

## 수락 기준

- `npm install notion-to-md` 설치 완료
- 상세 페이지에서 Notion 페이지 본문(제목, 단락, 리스트, 코드블록)이 정상 렌더링
- 이미지 로딩 실패 시 대체 텍스트 UI 표시
- 외부 링크에 `target="_blank"`, `rel="noopener noreferrer"` 적용
- TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. 패키지 설치
  - `npm install notion-to-md`
  - `remark-gfm`은 이미 설치됨(`package.json` 확인)

- [ ] 2. `lib/notion/content.ts` 생성
  - `NotionToMarkdown` 인스턴스 초기화 (Task 006의 `notionClient` 사용)
  - `getPageMarkdown(pageId: string): Promise<string>` 함수
    - `n2m.pageToMarkdown(pageId)` 호출
    - `n2m.toMarkdownString(mdBlocks)` 로 문자열 변환
    - Notion API 에러 시 빈 문자열 반환 (페이지 렌더링 중단 방지)
  - p-limit(3) 적용하여 Rate Limit 준수

- [ ] 3. `components/research/MarkdownRenderer.tsx` 생성 (`'use client'` 불필요 — 서버 컴포넌트)
  - props: `content: string`
  - `react-markdown` + `remark-gfm` 플러그인 사용
  - 커스텀 컴포넌트:
    - `a`: `target="_blank"`, `rel="noopener noreferrer"` 추가
    - `img`: `next/image` 대신 `<img>` 사용 (Notion 이미지 URL 도메인 다양), `onError` fallback UI
    - `code`: 인라인 코드는 `<code className="bg-muted px-1 rounded text-sm">` 스타일 적용
    - `pre`: 코드 블록에 `overflow-auto` 스타일 적용

- [ ] 4. `app/research/[id]/page.tsx` 수정
  - `getResearchById(id)` 이후 `getPageMarkdown(id)` 호출
  - 기존 더미 마크다운 텍스트를 `<MarkdownRenderer content={markdown} />` 로 교체
  - `getPageMarkdown` 반환값이 빈 문자열이면 "본문을 불러올 수 없습니다" placeholder 표시

## 테스트 체크리스트 (Playwright MCP)

- [ ] 제목/단락/리스트/코드블록이 올바르게 렌더링
- [ ] 이미지 로딩 실패 시 대체 UI("이미지를 불러올 수 없습니다") 표시
- [ ] 외부 링크 클릭 시 새 탭 열림 및 rel 속성 확인
- [ ] 빈 본문(markdown = '') 시 placeholder 표시
