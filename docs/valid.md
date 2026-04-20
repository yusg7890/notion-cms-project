# PRD 기술적 검증 결과: AI Stock Research Archive MVP

> 검증 대상: `/home/yusg7890/workspace/notion-cms-project/docs/PRD.md`
> 검증 일자: 2026-04-20
> 검증자: Claude Opus 4.7 (PRD 기술적 검증 전문가)
> 검증 방법론: Chain of Thought + 공식 문서 직접 확인 (WebFetch)

---

## Chain of Thought 검증 요약

### 추론 경로 (Reasoning Path)

1. **초기 관찰**: PRD는 Claude가 Notion MCP로 작성한 리서치를 Next.js + Vercel로 서빙하는 단일 사용자 CMS 시스템. 핵심 기술 스택은 Next.js 15, @notionhq/client, react-notion-x/notion-to-md, recharts, Vercel ISR.
2. **가설 설정**: 대부분의 기능은 검증 가능하나, Next.js 15 기반 설계가 실제 프로젝트의 Next.js 16과 충돌할 가능성이 있고, Notion 이미지 만료 이슈, MVP 범위(1일 구현) 현실성에 문제가 있을 것으로 예상.
3. **단계적 검증**: `package.json`에서 Next.js 16.2.4가 이미 설치된 것을 확인 → PRD의 Next.js 15 가정이 전면 어긋남. 공식 문서로 Next.js 16 Breaking Changes(async params, revalidateTag 시그니처 변경, PPR/Cache Components, middleware→proxy) 확인.
4. **논리적 연결**: Claude → Notion → Next.js 서버 → ISR 캐시 → 브라우저의 데이터 흐름은 기술적으로 실현 가능하나, 세부 API 사용법이 Next.js 16에 맞게 전면 재작성되어야 함.
5. **종합 판단**: **조건부 통과** — PRD의 의도와 목표는 구현 가능하지만, Next.js 버전 정렬과 몇 가지 스키마/운영 규칙 보강이 반드시 선행되어야 함.

### 기술적 확신도 분포

- **[FACT] 공식 문서 확인된 사실**: 약 55%
- **[INFERENCE] 사실 기반 논리적 추론**: 약 30%
- **[UNCERTAIN] 추가 검증 필요한 영역**: 약 15%

### 주요 발견사항

- **예상과 일치**: Notion API Rate Limit(초당 3회), ISR 자체는 기술적으로 가능, recharts로 line chart 구현 가능, 유사투자자문업 리스크는 실제로 존재.
- **예상과 다른 점**: **Next.js 15가 아니라 Next.js 16이 설치되어 있음** — PRD 전면 재정렬 필요. `revalidateTag()` 시그니처 변경, `params`/`searchParams` async 강제, PPR이 Cache Components로 대체됨.
- **추가 고려사항**: react-notion-x는 비공식 Notion API 토큰을 사용하므로 `@notionhq/client`와 조합이 모호함, Notion MCP의 구체적 DB 페이지 생성 규격이 공식 문서상 불명확.

---

## 검증 항목별 상세 결과

### 1. 기술 스택 실현 가능성 (Next.js + Notion API + react-notion-x/notion-to-md + Vercel) — 상태: ⚠️

<thought-process>
**관찰**: PRD는 Next.js 15 App Router, TypeScript 5.6+, React 19, TailwindCSS v4, shadcn/ui, @notionhq/client, react-notion-x 또는 notion-to-md, Recharts, Vercel을 명시한다.

**확인 사실**:
- [FACT] `package.json` 기준 **Next.js 16.2.4, React 19.2.4**가 이미 설치되어 있음. AGENTS.md는 "This is NOT the Next.js you know"라고 명시하며 `node_modules/next/dist/docs/` 참조를 강제함.
- [FACT] Next.js 16 공식 블로그(2025-10-21 발행) 기준:
  - `cookies()`, `headers()`, `draftMode()` 및 `params`, `searchParams`는 **async 전환이 강제됨**(동기 접근 완전 제거).
  - `revalidateTag()`는 이제 **두 번째 인자로 `cacheLife` 프로파일이 필수**(`revalidateTag('tag', 'max')` 형식).
  - `experimental.ppr` 제거, `cacheComponents` 플래그로 대체.
  - `middleware.ts` → `proxy.ts`로 deprecation.
- [FACT] Turbopack이 기본 번들러로 stable 승격.
- [FACT] react-notion-x v7.10.0 (2026-03-19 릴리스) — TypeScript + React 기반, 활발히 유지 중. 단, **비공식 Notion API(token_v2)를 사용**.
- [FACT] notion-to-md v3.1.9 (2025-05) — `@notionhq/client` 기반. v4 알파 개발 중.
- [FACT] recharts v3.8.1 (2025-03-25) — LineChart 지원. React 19 공식 호환 명시 없음.

**추론**:
- [INFERENCE] PRD가 "Next.js 15 (App Router)"로 단정 기술한 것은 실제 프로젝트 상태와 충돌하며, 모든 페이지 컴포넌트의 시그니처(`params`, `searchParams`)와 캐시 API 호출부를 Next.js 16 방식으로 작성해야 한다.
- [INFERENCE] react-notion-x가 비공식 API를 쓰는 점은 PRD에서 전혀 언급되지 않음. 공식 `@notionhq/client`로 페이지를 CRUD하되, 본문 렌더링만 react-notion-x로 하려면 **`notion-client`(별도 패키지)와 토큰을 추가로 관리**해야 함. 이 복잡성이 MVP에 부적절할 수 있음.
- [INFERENCE] notion-to-md 경로는 `@notionhq/client` 단일 토큰으로 가능하고 Next.js 16의 Server Component와 궁합이 좋아 MVP에 더 적합.

**중간 결론**: 스택 자체는 모두 실존·성숙한 라이브러리지만, **Next.js 16 기준 재정렬과 본문 렌더러 선택 기준 명확화**가 필수.
</thought-process>

- **[FACT]** Next.js 16.2.4 환경에서는 `export default async function Page({ params })` 내부에서 `const { slug } = await params` 를 사용해야 함.
- **[FACT]** `revalidateTag('research', 'max')` 처럼 두 번째 인자 필수.
- **[INFERENCE]** MVP 1일 구현이 목표라면 `notion-to-md` + `react-markdown` 조합이 `react-notion-x`보다 권장됨(단일 공식 토큰, 이미지 만료 대응도 더 단순).
- **권고**: PRD의 "기술 스택" 섹션을 Next.js 16 기준으로 개정. "Notion 본문 렌더링 = notion-to-md + react-markdown (1순위)"로 명시 변경.

---

### 2. Notion DB 스키마 완전성 및 API 호환성 — 상태: ⚠️

<thought-process>
**관찰**: PRD는 Research 타입에 id, title, stockName, ticker, sector(Select), tags(Multi-select), opinion('BUY'|'HOLD'|'SELL'), targetPrice(number), summary, publishedAt(Date), status('DRAFT'|'PUBLISHED'), aiModel(string) 11개 필드를 정의.

**확인 사실**:
- [FACT] Notion API `POST /v1/databases/{id}/query`는 Select 필드에 대해 `{"filter": {"property": "상태", "select": {"equals": "발행"}}}` 문법을 지원.
- [FACT] Sorts 파라미터로 `publishedAt` 내림차순 정렬 가능.
- [FACT] Notion 페이지 속성은 한국어 레이블도 허용 (property key는 사용자 정의).

**추론 및 불일치**:
- [INFERENCE] PRD의 **타입 정의(`opinion: 'BUY'|'HOLD'|'SELL'`)**와 **Claude 저장 규칙(`매수/관망/매도`)**이 **코드 상수와 Notion Select 옵션 사이에 매핑 로직을 강제**한다. 이 매핑 규칙이 명시되지 않음.
  - 예: Notion Select 옵션명을 '매수/관망/매도'로 두면, Next.js 필터 쿼리 `select.equals`에 한국어를 그대로 써야 함. 코드 enum은 'BUY'/'HOLD'/'SELL'이므로 양방향 매핑 테이블이 필요.
- [INFERENCE] **`status: 'DRAFT'|'PUBLISHED'`**도 동일 문제. Notion Select 옵션이 '초안'/'발행'이면 쿼리에도 한글 그대로 전달 필요.
- [UNCERTAIN] **Property 키(DB 컬럼명)가 영어인지 한국어인지 PRD에 명시 없음**. 스키마 정의에는 영어 필드(stockName, ticker, targetPrice 등)가 쓰였으나 실제 Notion DB 컬럼이 '종목명', '티커', '목표가' 라면 mapper가 더 복잡해짐.
- [INFERENCE] 목표가가 원/달러를 혼용 저장한다고 했는데 `targetPrice: number` 하나에 통화 구분이 없음. 히스토리 차트에서 원화 종목과 달러 종목이 섞이면 축 단위가 엉망이 됨.
- [INFERENCE] ticker는 종목 히스토리 URL 키(`/stocks/[ticker]`)인데 `stockName` 변경 시 키 일관성 유지 규칙이 없음. Claude가 티커 표기(예: `005930` vs `KRX:005930`)를 일관되게 쓸 것인지 강제 검증 수단이 없음.

**중간 결론**: 스키마는 구조적으로 유효하나 **(a) property 키 매핑 테이블, (b) currency 필드, (c) Select 옵션 한/영 매핑**이 추가되어야 안정적으로 동작함.
</thought-process>

- **[FACT]** `@notionhq/client`의 `databases.query` API는 PRD 스키마로 충분히 커버 가능.
- **[INFERENCE]** 누락 필드: `currency`('KRW'|'USD') 가 반드시 필요. 다국 종목 혼재 시 목표가 차트 Y축 해석 불가.
- **[INFERENCE]** Notion property key와 TS 타입 간 매핑 레이어(`lib/notion/mapper.ts` 권장) 명시 필요.
- **권고**: 데이터 모델 섹션에 ① property 키 정확한 문자열(한글 or 영문) 명시, ② `currency` 필드 추가, ③ Select 옵션 상수와 enum 간 매핑 테이블 예시 코드 추가.

---

### 3. AI 분석 플로우 (Claude + Notion MCP) 구현 가능성 — 상태: ⚠️

<thought-process>
**관찰**: PRD는 사용자가 Claude Desktop / Claude.ai에서 "삼성전자 분석해줘"를 요청하면 Claude가 Notion MCP로 DB에 페이지를 생성, 상태='초안'으로 저장하고, 사용자가 검토 후 '발행'으로 바꾸는 플로우를 설명한다.

**확인 사실**:
- [FACT] Notion MCP 공식 서버는 hosted server로 존재하며 "read and write to your Notion pages"가 가능하다고 공식 문서에 기술됨.
- [FACT] Claude Desktop / Claude Code는 MCP 클라이언트로 기능.

**불확실성**:
- [UNCERTAIN] **Notion MCP가 "Database에 새 페이지를 생성하면서 모든 속성(Select, Multi-select, Number, Date)을 정확히 채우는 단일 호출"을 안정적으로 제공하는지** 공식 문서에 명시 없음. 소개 페이지는 추상적 기능만 나열.
- [UNCERTAIN] Claude가 한 번의 사용자 요청에서 "분석 수행 + Notion 페이지 생성 + 11개 필드 정확 입력 + 본문 렌더링"을 **일관되게** 수행할 확률이 검증되지 않음.
- [INFERENCE] F010(저장 규칙)은 프롬프트 지시로 강제되지만, MCP 도구가 `select` 옵션에 없는 값을 쓰거나(옵션 자동 생성), AI 모델명을 하드코딩 않거나(`Claude 3.5` 등 구버전 표기) 하는 **할루시네이션 리스크**가 있음.

**중간 결론**: 플로우 자체는 "MCP로 페이지 CRUD 가능" 근거 상 실현 가능하나, **(a) Claude용 시스템 프롬프트/지침 문서, (b) 저장 직후 스키마 검증 도구(선택적 웹훅 또는 관리 라우트)**가 별도 산출물로 필요.
</thought-process>

- **[FACT]** Notion MCP로 페이지 생성·쓰기가 공식 지원됨.
- **[UNCERTAIN]** DB 속성 전체를 한 번에 정확히 세팅하는 MCP 도구 명세는 공식 문서에서 확인 불가 → **실제 MCP 설치 후 실험 필요**.
- **[INFERENCE]** F010은 "운영 규칙"으로만 기술되어 있어 강제력이 약함. 초안 저장 시 필드가 비어있으면 웹 빌드가 깨질 수 있음.
- **권고**: ① Claude용 시스템 프롬프트 템플릿 별도 문서화(`docs/claude-prompt.md` 권장), ② `/api/revalidate` 라우트에서 스키마 필수 필드(`ticker`, `publishedAt`, `opinion`) 누락 검증 및 경고 추가.

---

### 4. 종목 히스토리 페이지 — 목표가 차트(recharts) 실현 가능성 — 상태: ✅

<thought-process>
**관찰**: PRD는 종목 히스토리 페이지에서 x축=발행일, y축=목표가인 LineChart를 recharts로 렌더링하고자 한다.

**확인 사실**:
- [FACT] recharts v3.8.1 기준 `LineChart`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`, `Line` 컴포넌트 모두 지원.
- [FACT] 데이터 포맷은 `[{ date: '2026-04-01', targetPrice: 85000 }, ...]` 배열 형태로 단순.
- [FACT] 동일 종목의 Research 배열을 `publishedAt` 오름차순으로 정렬 후 매핑하면 완성.

**추론**:
- [INFERENCE] react 19 호환성은 공식 명시가 없지만 v3.8.1이 2025-03 릴리스 + peerDependencies가 대체로 `>=16` 수준으로 유연해 **실사용상 이슈는 드묾**. Next.js 16 Client Component('use client')로 감싸면 안전.
- [INFERENCE] **투자의견 변화 타임라인(매수/관망/매도 배지)**은 recharts의 `ReferenceLine` + 커스텀 dot로 표시하거나, 차트 하단 별도 타임라인 컴포넌트로 분리 구현 가능.

**중간 결론**: 차트 구현은 기술적으로 매우 무리가 없음. 데이터 양이 종목당 수십 건 수준이라 성능 이슈도 없음.
</thought-process>

- **[FACT]** recharts 3.x에서 LineChart로 요구 차트 완전 구현 가능.
- **[INFERENCE]** Server Component에서 데이터 쿼리 → Client Component로 차트 props 전달 패턴이 Next.js 16에서 표준.
- **권고**: 통화 혼재 이슈(§2 참고) 때문에 차트 컴포넌트는 **단일 currency만 받도록** props 제약. 혼재 시 경고 메시지 표시.

---

### 5. ISR / on-demand revalidation 전략의 타당성 — 상태: ❌

<thought-process>
**관찰**: PRD는 메인 3600초, 상세 86400초, 종목 히스토리 3600초 ISR과 `POST /api/revalidate?secret=[TOKEN]` on-demand 라우트를 명시. `revalidate: 3600초 기본값, 운영 중 조정 가능`.

**확인 사실**:
- [FACT] Next.js 16은 **모든 동적 코드가 기본적으로 request-time 실행**으로 전환됨. 암묵적 캐싱은 사라지고 `"use cache"` 또는 `cacheComponents: true` 설정이 **명시적 opt-in** 방식.
- [FACT] Route segment의 `export const revalidate = 3600`은 여전히 지원되지만, Next.js 16에서는 **Cache Components / `"use cache"` + `cacheLife('hours')`** 패턴이 권장.
- [FACT] `revalidatePath(path)` 는 여전히 가용하나, `revalidateTag()`는 **두 번째 인자 필수**(예: `revalidateTag('research-list', 'max')`).
- [FACT] PPR 플래그(`experimental.ppr`, `experimental_ppr`)는 **제거됨**.

**추론**:
- [INFERENCE] PRD의 `revalidate: 3600`만 써도 기본 ISR은 동작하나, **"on-demand revalidation → POST /api/revalidate"** 구현 시 `revalidatePath`를 쓰거나, tag 기반으로 한다면 반드시 새 시그니처를 사용해야 함. PRD는 이 세부가 전혀 반영되지 않았음.
- [INFERENCE] "상세 페이지 86400초"는 Notion에서 본문을 직접 수정해도 24시간 동안 반영되지 않는다는 뜻 → 실제 운영에서 `on-demand revalidate`가 사실상 필수. 이 부분은 PRD가 잘 짚었으나, 수동 호출 방식이 1인 개발자에게 귀찮아 실효성 낮음.
- [UNCERTAIN] Notion "Automation 웹훅"을 PRD가 언급했으나, **Notion Automation은 외부 HTTP webhook을 원시 지원하지 않음**(2026-04 기준, 공식 HTTP webhook은 제한적 preview).

**중간 결론**: 전략의 방향성(ISR + on-demand)은 맞지만, **(a) Next.js 16의 새 revalidateTag 시그니처, (b) Cache Components 선택 여부, (c) Notion 웹훅 실존성**이 재검토되어야 함.
</thought-process>

- **[FACT]** Next.js 16에서 `revalidateTag('tag')`는 **deprecated**. `revalidateTag('tag', 'max')` 형식 강제.
- **[FACT]** `experimental.ppr` 제거 → `cacheComponents: true` 로 이전.
- **[UNCERTAIN]** Notion Automation의 외부 웹훅 발신 기능은 PRD가 기대하는 수준으로 안정 지원되지 않을 수 있음 → **사용자가 Notion 버튼/속성 변경을 트리거로 Zapier/Make 같은 중계 서비스를 끼워야 할 가능성** 높음.
- **권고**: 
  - ISR 전략 섹션에 **`revalidateTag(tag, cacheLife)` 새 시그니처 예시 코드** 포함.
  - **on-demand 경로를 `revalidatePath('/')` 기반으로 단순화**하고 Notion 웹훅은 "v2 확장"으로 이동.
  - MVP는 **수동 `/api/revalidate` 호출(간이 대시보드 혹은 북마클릿)**로 충분.

---

### 6. Rate limit 대응 방안의 충분성 — 상태: ⚠️

<thought-process>
**관찰**: PRD는 "기본 limit: 3 requests/second, ISR 캐싱, `@notionhq/client` 내장 retry, `timeoutMs`, `generateStaticParams`"를 대응책으로 제시.

**확인 사실**:
- [FACT] Notion 공식 문서: "average of three requests per second" + 429 응답 시 `Retry-After` 헤더 존중 권장.
- [FACT] 페이로드 제한: 1,000 block, 500KB, 배열 원소 100개, 텍스트 2,000자.

**추론**:
- [INFERENCE] ISR로 대부분 캐시 히트되므로 런타임 트래픽은 문제 없음. 진짜 병목은 **(a) 빌드 타임 `generateStaticParams`에서 전체 리서치 조회 + 상세 페이지 N건 생성, (b) 종목 히스토리 빌드 시 종목별 쿼리**가 3 req/s 넘는 경우.
- [INFERENCE] `@notionhq/client` 내장 retry는 있으나 **429 재시도 간격이 `Retry-After` 값보다 짧으면 무한 루프** 가능. 공식 클라이언트는 `Retry-After`를 기본적으로 존중하지만 PRD가 이를 확인하지 않고 "retry 옵션 활용"만 기술.
- [INFERENCE] 빌드 시 100건 이상이 되는 시점부터 문제 발생 가능 → **큐/bottleneck 라이브러리(p-limit 등)로 동시성 제어**가 필요하지만 PRD에 언급 없음.

**중간 결론**: 현재 대응책은 소규모에서 충분하나, 수백 건 스케일에서 빌드 실패 가능. 구체 큐 전략 보강 권장.
</thought-process>

- **[FACT]** Notion 기본 rate limit = 평균 3 req/s, 429 시 `Retry-After` 존중.
- **[INFERENCE]** 초기 MVP(수~수십 건)에서는 충분. 100건 이상 스케일 시 `p-limit(concurrency: 3)` 같은 빌드 타임 큐 필요.
- **권고**: "Rate limit 대응" 섹션에 **빌드 타임 동시성 제한(3)을 명시**, 페이로드 제한(블록 1,000개, 텍스트 2,000자)을 F010 저장 규칙에 반영.

---

### 7. 법적 리스크 대응(유사투자자문업 면책 문구)의 실효성 — 상태: ⚠️

<thought-process>
**관찰**: PRD는 모든 페이지 하단에 면책 문구를 표시하고, About 영역에 "개인 기록용, 비상업적 운영" 명시를 권고. 필요 시 비공개 전환.

**확인 사실**:
- [FACT] 자본시장법 및 금융투자업규정상 "유사투자자문업"은 **불특정 다수를 상대로 유상으로 투자판단에 관한 자문을 제공하는 행위**를 포괄적으로 규율. 무상·비공개·개인기록은 원칙적으로 해당 없음.
- [FACT] 그러나 **공개 웹(Vercel URL 도메인)에 배포**되고 검색엔진이 색인할 경우 "불특정 다수 접근 가능"으로 해석될 여지가 있음.

**추론**:
- [INFERENCE] 면책 문구 단독으로는 법적 방패가 되지 못함 (판례상 "실질이 자문이면 형식이 면책이라도 업으로 판단"). 그러나 **(a) 무상 제공, (b) AI 자동 생성임을 명시, (c) 종목 추천이 아닌 개인 학습 기록 포지셔닝**이라면 업으로 판단될 가능성은 매우 낮음.
- [INFERENCE] 더 강력한 방어는 **(i) robots.txt / noindex 메타로 검색엔진 차단, (ii) Vercel 프로젝트 보호(Password Protection) 활성화, (iii) `/` 루트에 "접근 제한 안내"** 조합.
- [UNCERTAIN] 한국 법률 전문가 자문 필요 영역. PRD는 면책 문구만 제시했을 뿐 접근 제어 옵션을 보조 도구로만 취급.

**중간 결론**: 면책 문구는 필요조건이지만 충분조건이 아님. 공개 배포 시 **`noindex` + 고유 URL 유지 + 접근 제한**이 실효 방어.
</thought-page>

**중간 결론**: 면책 문구는 필요조건이지만 충분조건이 아님. 공개 배포 시 **`noindex` + 고유 URL 유지 + 접근 제한**이 실효 방어.
</thought-process>

- **[INFERENCE]** 면책 문구는 **최소 요건**이지만 면책의 절대적 방패는 아님.
- **[INFERENCE]** 공개 배포 시 실효 방어: `noindex` 메타태그, `robots.txt` Disallow, Vercel Password Protection, 본문 내 "종목 추천 아님" 반복 명시.
- **[UNCERTAIN]** 공개 가능성을 조금이라도 여지 두려면 **한국 법률 전문가 검토 1회**는 실질적으로 권장.
- **권고**: ① 모든 페이지에 `<meta name="robots" content="noindex, nofollow" />` 기본 적용, ② `app/robots.ts`에서 `Disallow: /` 기본값, ③ 공개 여부를 env flag(`NEXT_PUBLIC_SITE_INDEXABLE=false`)로 토글 가능하게 설계.

---

### 8. MVP 범위가 솔로 개발자 1일 내 구현 가능한 수준인지 — 상태: ❌

<thought-process>
**관찰**: PRD는 F001~F007 (7개 핵심) + F010~F011 (운영 규칙 2개), 4개 페이지(메인/상세/종목 히스토리/검색)를 MVP로 정의.

**추론 — 페이지별 구현 공수 추정** (숙련 솔로 개발자 기준):
- [INFERENCE] 프로젝트 부트스트랩 + Notion DB 설계 + 토큰 세팅: **1~2시간**
- [INFERENCE] Notion mapper (`lib/notion/mapper.ts`, property key 매핑 포함): **2시간**
- [INFERENCE] 메인 페이지 (카드 그리드 + 섹터/태그 필터 + 페이지네이션): **2~3시간**
- [INFERENCE] 상세 페이지 (notion-to-md + react-markdown 렌더링 + 메타 헤더 + 이전/다음 네비): **3시간**
- [INFERENCE] 종목 히스토리 페이지 (시계열 쿼리 + recharts 차트 + 타임라인): **3~4시간**
- [INFERENCE] 검색 페이지 (클라이언트 필터 + URL 쿼리 연동): **1~2시간**
- [INFERENCE] ISR/revalidate 라우트 + 면책 문구 컴포넌트 + robots: **1~2시간**
- [INFERENCE] Vercel 배포 + Notion 토큰 환경변수 + 스모크 테스트: **1시간**

**합계**: 약 **14~19시간** → 하루(8시간)로는 **불가능**. 이틀 풀 가동(16시간) 기준에도 빠듯.

- [INFERENCE] **Next.js 16 async params 및 revalidateTag 시그니처 변경 학습 곡선**이 기존 Next.js 14/15 경험자에게도 2~3시간 추가 소요 가능.
- [INFERENCE] react-notion-x 대신 notion-to-md 경로 택할 시 **블록 타입별 커스텀 렌더러 작성**이 몇 시간 더 필요할 수 있음.

**중간 결론**: 사용자 표현대로 "솔로 개발자 1일 내 구현"은 비현실적. **2.5~3 평일**(총 20~24시간)이 현실적 범위.
</thought-process>

- **[INFERENCE]** 순수 코딩만 14~19시간 추정 → 1일(8시간) 목표는 **과소추정**.
- **[INFERENCE]** Next.js 16 신규 API 학습 + 디버깅 오버헤드 포함 시 **최소 2~3 영업일** 필요.
- **권고**: 
  1. MVP를 **"D1: 메인 + 상세", "D2: 종목 히스토리 + 차트", "D3: 검색 + 운영(revalidate, 면책, 배포)"**로 3일 스프린트로 분할.
  2. 1일 내 완성 제약이 정말 절대적이라면, **F003(검색)과 F005(종목 히스토리 차트)를 v1.1로 디퍼**하고 메인+상세만 먼저 MVP화.

---

### 9. 누락되었거나 모호한 요구사항 — 상태: ❌

<thought-process>
**관찰 + 추론**: PRD 전체를 역으로 훑으면서 "코드 작성 시 즉시 결정해야 할 사항 중 PRD에 미정인 것"을 나열.
</thought-process>

| 구분 | 누락/모호 항목 | 필요한 명세 |
|---|---|---|
| 스키마 | Notion DB property key의 언어(한/영) | 실제 문자열 예: `"종목명"` or `"stockName"` |
| 스키마 | `currency` 필드 부재 | `'KRW' \| 'USD'` 필수 추가 |
| 스키마 | `status` Select 옵션명 | Notion 측 정확 라벨(예: `초안`/`발행` vs `Draft`/`Published`) |
| 스키마 | 리서치 Slug / URL 전략 | 상세 페이지 URL 구조(`/research/[page-id]` vs `/research/[slug]`) |
| 스키마 | 동일 종목 식별 키 | `ticker` 단독 vs `ticker+market` 조합 |
| 플로우 | `publishedAt` 값 기준 | Claude가 자동 채우는지, Notion 상태 변경 시점인지 |
| 플로우 | "발행" 트리거 후 revalidate 호출 주체 | 수동/자동/웹훅 중 확정 필요 |
| 페이지네이션 | 메인 페이지 페이지 크기 | 예: 페이지당 20건, 무한 스크롤 cursor 기반 여부 |
| 필터 | 섹터/태그 필터 기본 동작 | AND vs OR, 다중 선택 시 정렬 변경 여부 |
| 렌더링 | Notion 이미지 허용 여부 | PRD는 "최소화 권장"이지만 MVP에서 완전 금지/허용/자동 프록시 중 선택 |
| 검색 | 검색 범위 | 종목명/티커/태그만 vs 본문 텍스트 포함 |
| 검색 | 검색 구현 위치 | 클라이언트 필터 vs Notion API 쿼리 |
| 보안 | `/api/revalidate` secret 관리 | 환경 변수 이름, 실패 시 응답 코드, 로그 정책 |
| i18n | 숫자 포맷 | `targetPrice` 렌더링 시 `₩85,000` / `$85.00` 규칙 |
| 에러 | 404/500 페이지 | Notion API 장애 시 fallback UI 명세 없음 |
| 접근성 | 키보드 내비 / 차트 대체 텍스트 | 차트 데이터 표 병기 여부 |
| SEO/색인 | 검색엔진 색인 여부 | §7 참고, 기본 noindex 여부 결정 |
| 모니터링 | 에러 로그/알림 | Vercel 로그 외 Sentry 등 필요 여부 |

---

### 10. 개선 권고사항 — 상태: ⚠️

<thought-process>
**정리 원칙**: 
1. Next.js 16 정렬을 **Critical**로 최우선.
2. 스키마 불완전은 **Major** (현재는 동작해도 향후 데이터 오염 리스크).
3. MVP 범위 조정은 **Major**.
4. SEO/법적/운영 디테일은 **Minor**.
</thought-process>

#### 🔴 Critical (즉시 수정)

1. **Next.js 버전 정렬**
   - PRD `기술 스택` 섹션의 `Next.js 15` → **`Next.js 16`**으로 수정.
   - `params`, `searchParams` 사용 예시를 `await params`/`await searchParams` 패턴으로 갱신.
   - `revalidateTag('tag')` → `revalidateTag('tag', 'max')` 로 교체.
   - `middleware.ts` 가 필요해지면 `proxy.ts` 네이밍 사용.
   - AGENTS.md 지침 ("Read the relevant guide in `node_modules/next/dist/docs/`") 준수 명시.

2. **Notion DB 스키마에 `currency` 필드 추가** — KRW/USD 혼재로 인한 차트 무의미화 방지.

3. **Notion property key 언어 결정 및 mapper 계약 고정** — 코드 진입 전 필수.

#### 🟡 Major (개발 전 개선 권장)

4. **react-notion-x vs notion-to-md 1순위 재확인**
   - react-notion-x는 비공식 API(`token_v2`) 요구 → 이중 토큰 관리 복잡.
   - MVP는 **notion-to-md + react-markdown**을 1순위로 확정 권장.

5. **MVP 일정 현실화**
   - 1일 목표를 3일 스프린트(D1/D2/D3)로 재편성하거나, 검색·차트를 v1.1로 디퍼.

6. **on-demand revalidation 단순화**
   - Notion Automation 웹훅 대신 **수동 `/api/revalidate` + 간이 관리 페이지(비공개)** 로 MVP 시작.

7. **SEO/법적 기본값 noindex**
   - `app/layout.tsx`에 `metadata.robots = { index: false, follow: false }` 기본 설정.
   - env flag로 공개 여부 토글.

8. **빌드 시 Notion API 동시성 제한**
   - `p-limit(3)` 또는 직렬 순회로 3 req/s 준수.

#### 🟢 Minor (선택적 개선)

9. **Claude 시스템 프롬프트 별도 문서화** (`docs/claude-prompt.md`).
10. **스키마 검증 유틸** (Zod 스키마로 Notion 응답 파싱 → 필수 필드 누락 시 빌드 경고).
11. **차트 접근성** — LineChart 옆에 동일 데이터 `<table>` 병기(스크린리더 대응).
12. **에러 바운더리 & Notion 장애 fallback UI** (`error.tsx`, `not-found.tsx`).
13. **모니터링** — Vercel 기본 로그 + 선택적으로 Sentry 연동.
14. **이미지 처리 가이드** — 이미지가 불가피한 경우 `/api/image-proxy`로 S3/Cloudflare R2 캐싱.
15. **통화별 렌더링 포맷터** (`Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })`).

---

## 최종 검증 판정

### 종합적 추론 체인

```
[관찰] Next.js 16 이미 설치 + Notion MCP/API 확인 + 솔로 1인 CMS 스코프
   ↓
[사실확인] Next.js 16 Breaking Changes (async params, revalidateTag 시그니처, PPR 제거, proxy.ts)
   ↓
[논리성] PRD 기술 의도(ISR+Notion+차트)는 유효, 세부 API 형태만 재작성 필요
   ↓
[실현가능성] 14~19시간 공수(솔로), 1일 목표는 비현실적이나 3일 내 가능
   ↓
[종합판정] 조건부 통과 (Critical 3건 + Major 5건 선행 시 구현 가능)
```

### Chain of Thought 요약

1. **Because** [FACT] Next.js 16은 App Router 기반이며 ISR/on-demand revalidate/generateStaticParams가 여전히 지원된다…
2. **And** [FACT] `@notionhq/client`는 필요한 DB 쿼리 필터와 Select/Multi-select/Number/Date를 모두 처리하며, Notion MCP로 페이지 생성이 가능하다…
3. **But** [FACT] PRD가 명시한 "Next.js 15"는 실제 `package.json`과 어긋나고, `revalidateTag` 시그니처/async params/PPR 구조가 전면 변경되었으며, 스키마에 `currency` 누락, 1일 구현 공수 추정이 비현실적이다…
4. **Therefore** PRD 자체의 의도와 구조는 실현 가능하나, **(i) Next.js 16 정렬, (ii) 스키마 보강, (iii) 일정 재조정**이 선행되어야 안전하게 구현 가능하다.

### 기술적 판정

**최종 판정**: ⚠️ **조건부 통과 (Conditional Pass)**
— 현재 상태로 착수하면 Next.js 16 호환 문제와 스키마 공백으로 개발 중반에 재작업이 발생함. 위 Critical 3건만 수정해도 안전 구현 가능.

### 신뢰도 및 위험도 점수

| 지표 | 점수 | 근거 |
|---|---|---|
| 기술적 신뢰도 (공식 문서 기반) | **7.5 / 10** | Next.js/Notion/recharts 공식 문서 확인 완료, MCP 세부는 UNCERTAIN |
| 구현 복잡도 (솔로 기준) | **6 / 10** | 중간. 본문 렌더러 선택과 스키마 mapper가 병목 |
| 외부 의존 위험 (Notion API, MCP) | **6 / 10** | Rate limit은 관리 가능, MCP 동작 일관성은 실험 필요 |
| 전체 위험도 | **6 / 10** | Critical 수정 시 4로 하락 |

### 추가 검증이 필요한 영역

- **[UNCERTAIN]** Notion MCP가 DB 페이지를 Select/Multi-select/Number까지 정확 세팅하는 도구 동작 — 실제 설치 후 smoke test 필요.
- **[UNCERTAIN]** Notion Automation의 외부 HTTP 웹훅 지원 수준 — Zapier/Make 중계 필요 여부.
- **[UNCERTAIN]** react-notion-x v7.10의 React 19 호환 공식 확약.
- **[UNCERTAIN]** Vercel Hobby 플랜의 빌드 타임아웃이 대량 페이지 생성 시 충분한지.

### 개발 진행 권장사항

1. **즉시 해결 (Critical)**: Next.js 16 기준 PRD 개정, `currency` 필드 추가, property key 언어 결정.
2. **개발 전 확인 (Major)**: notion-to-md 1순위 채택 결정, 3일 스프린트 재편성, `noindex` 기본값 확정.
3. **개발 중 적용 (Minor)**: 동시성 제한, Zod 스키마 검증, 접근성, 에러 바운더리.
4. **지속 검토**: Notion API 정책 변경 모니터링, Next.js 16 마이너 업데이트 추적.

---

## 부록: 자기 검증 루프

<reflection>
**Step-back 질문들:**
1. "내가 놓친 중요한 기술적 제약이 있는가?"
   → Vercel 빌드 타임아웃(Hobby 45초, Pro 300초)이 대량 `generateStaticParams`에서 문제 될 수 있음. 본문에 [UNCERTAIN]으로 추가 기록함.
2. "내 추론 과정에 논리적 비약이나 환각이 있는가?"
   → Next.js 16 Breaking Changes는 공식 블로그·업그레이드 가이드 두 개를 직접 확인함. react-notion-x/notion-to-md 유지상태는 GitHub 페이지 직접 확인 (WebFetch).
3. "확인되지 않은 정보를 사실로 제시했는가?"
   → Notion MCP의 DB 속성 세팅 상세 동작은 [UNCERTAIN]으로 유지했음. 법적 해석은 [INFERENCE]로 표기.

**환각 재점검:**
- [FACT] 태그된 항목은 모두 공식 문서 기반.
- 1일 공수 추정은 [INFERENCE]로 명시.
- 솔로 개발자 공수는 환경·경험 편차가 크므로 "추정"을 분명히 했음.

**결론 재검토:**
- "조건부 통과" 판정은 PRD의 방향성(Notion 중심 1인 CMS + 시계열 차트)이 명확하고 실현 가능하므로 과도한 부정이 아니며, 동시에 Next.js 버전 불일치 같은 실질 장애물이 명확하므로 무조건 통과도 아님. 균형 잡힌 판정으로 판단됨.
</reflection>
