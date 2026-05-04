# Task 011: 법적 안전장치 및 SEO 차단

## 목적 및 배경

공개 웹 서비스로 배포하기 전 유사투자자문업 관련 법적 리스크를 최소화한다.
robots.ts, noindex, DisclaimerBanner는 Phase 2·3에서 기반 구현이 완료된 상태이며,
이 태스크에서는 누락 지점을 채우고 Claude → Notion 저장 규칙을 문서화한다.

## 현재 구현 상태

- `app/robots.ts` — `NEXT_PUBLIC_SITE_INDEXABLE` 환경 변수 기반 차단 ✅
- `app/layout.tsx` — `robots: { index: false, follow: false }` 루트 메타데이터 ✅
- `components/common/DisclaimerBanner.tsx` — 면책 문구 컴포넌트 ✅
- `components/common/Footer.tsx` — DisclaimerBanner 포함, layout.tsx에서 전역 적용 ✅

## 관련 파일

- `app/research/[id]/page.tsx` — 수정 (상세 페이지 강화 면책 문구)
- `app/expert/page.tsx` — 확인 (noindex 누락 여부)
- `app/stocks/[ticker]/page.tsx` — 확인 (noindex 누락 여부)
- `app/search/page.tsx` — 확인 (noindex 누락 여부)
- `docs/notion-rules.md` — 신규 생성 (Claude→Notion 저장 규칙 문서화)

## 수락 기준

- 모든 동적 라우트(`/research/[id]`, `/stocks/[ticker]`, `/search`, `/expert`)에 `generateMetadata`로 `robots: { index: false, follow: false }` 적용
- 상세 페이지(`/research/[id]`) 본문 영역 위 또는 아래에 강화 면책 문구 노출 (DisclaimerBanner 외에 인라인 문구 추가)
- `docs/notion-rules.md` 생성 — PRD F010 저장 규칙을 실무 체크리스트 형태로 정리
- `npm run build` 성공 및 TypeScript 컴파일 오류 없음

## 구현 단계

- [ ] 1. 동적 라우트 noindex 적용 확인 및 보완
  - `app/research/[id]/page.tsx` — `generateMetadata` 내 `robots: { index: false, follow: false }` 추가 (없으면 추가)
  - `app/stocks/[ticker]/page.tsx` — 동일 적용
  - `app/expert/page.tsx` — 정적 라우트이므로 `export const metadata` 레벨 확인
  - `app/search/page.tsx` — 동일 확인

- [ ] 2. 상세 페이지 강화 면책 문구
  - `app/research/[id]/page.tsx` — 본문 마지막 섹션에 인라인 면책 노트 추가
  - "본 분석은 AI(Claude)가 생성한 개인 학습 기록이며, 투자 권유가 아닙니다." 문구를 본문 아래 `<aside>` 요소로 표시

- [ ] 3. `docs/notion-rules.md` 작성
  - PRD F010 기반 Notion 저장 규칙을 실무 체크리스트 형태로 정리
  - 필수 Property Key 목록, Select 옵션 상수, 저장 전 확인 사항
  - Expert Research / AI Research 구분 저장 규칙 명시

- [ ] 4. 빌드 검증
  - `npm run build` 실행 및 성공 확인

## 테스트 체크리스트

- [ ] `curl https://[배포URL]/robots.txt` → `Disallow: /` 포함
- [ ] 상세 페이지(`/research/[id]`) 소스에 `<meta name="robots" content="noindex">` 포함
- [ ] 종목 히스토리 페이지(`/stocks/[ticker]`) 소스에 동일 메타태그 포함
- [ ] 모든 페이지 하단에 DisclaimerBanner 표시 확인
- [ ] 상세 페이지에 인라인 면책 문구 표시 확인
