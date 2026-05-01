# Task 012: 성능 최적화 및 Vercel 배포

## 목적 및 배경

MVP의 최종 단계. 불필요한 의존성을 정리하고 Vercel에 배포하여 실제 서비스 URL을 확보한다.
배포 후 프로덕션 스모크 테스트로 전체 플로우가 정상 동작함을 확인한다.

## 관련 파일

- `next.config.ts` — 수정 (번들 분석기 옵션 추가 가능)
- `package.json` — 확인 (불필요 의존성 점검)
- `app/` — 전체 페이지 빌드 출력 확인
- `.env.local` — 환경 변수 확인 (로컬)
- Vercel 대시보드 — 환경 변수 설정 (외부)

## 수락 기준

- `npm run build` 경고 없이 성공 (unused import, missing key prop 등 포함)
- `npm run lint` 오류 없음
- Vercel 프로젝트 연결 및 첫 배포 성공
- 프로덕션 URL에서 AI Research / Expert Research / 검색 / 상세 / 히스토리 페이지 모두 정상 동작
- Vercel 환경 변수 4종 설정 완료: `NOTION_TOKEN`, `NOTION_AI_DB_ID`, `NOTION_EXPERT_DB_ID`, `REVALIDATE_SECRET`

## 구현 단계

- [ ] 1. 빌드 사전 점검
  - `npm run build 2>&1` 출력 검토 — warning/error 목록 정리
  - TypeScript 엄격 모드 오류 수정
  - lint 오류 수정 (`npm run lint`)

- [ ] 2. 불필요 의존성 점검
  - `recharts` 사용 여부 확인 — Chart.js로 교체 후 미사용 시 제거
  - `react-hook-form` / `zod` 실제 사용 페이지 확인
  - `package.json` devDependencies에 `@next/bundle-analyzer` 추가 및 번들 크기 점검 (선택)

- [ ] 3. ISR / 캐시 태그 최종 검토
  - `app/page.tsx`, `app/expert/page.tsx` — `revalidate: 3600` 선언 확인
  - `app/research/[id]/page.tsx` — `revalidate: 86400` 확인
  - `app/stocks/[ticker]/page.tsx` — `revalidate: 3600` 확인
  - `app/search/page.tsx` — `revalidate: 0` (동적) 확인
  - `app/api/revalidate/route.ts` — `revalidateTag` 두 번째 인자 `'max'` 확인

- [ ] 4. Vercel 프로젝트 연결
  - `vercel link` 또는 Vercel 대시보드에서 GitHub 레포 연결
  - Framework Preset: Next.js 선택 확인
  - Build Command: `npm run build`, Output Directory: `.next`

- [ ] 5. Vercel 환경 변수 설정
  - `NOTION_TOKEN` — Notion Integration Secret
  - `NOTION_AI_DB_ID` — AI Research Notion DB ID
  - `NOTION_EXPERT_DB_ID` — Expert Research Notion DB ID
  - `REVALIDATE_SECRET` — On-demand 재검증 시크릿 토큰
  - `NEXT_PUBLIC_SITE_INDEXABLE` — `false` (기본값, SEO 차단 유지)

- [ ] 6. 첫 배포 및 스모크 테스트
  - `vercel --prod` 또는 대시보드 Deploy 버튼
  - 배포 URL에서 5개 핵심 플로우 Playwright MCP 테스트 실행

## 테스트 체크리스트 (프로덕션 스모크)

- [ ] `[배포URL]/` — AI Research 카드 목록 정상 표시
- [ ] `[배포URL]/expert` — Expert Research 카드 목록 정상 표시
- [ ] `[배포URL]/research/[id]` — Notion 본문 렌더링 정상
- [ ] `[배포URL]/stocks/[ticker]` — 히스토리 차트 렌더링 정상
- [ ] `[배포URL]/search?q=삼성전자` — 검색 결과 반환
- [ ] `POST [배포URL]/api/revalidate?secret=[TOKEN]` → `200 {"revalidated":true}`
- [ ] `[배포URL]/robots.txt` → `Disallow: /` 포함
