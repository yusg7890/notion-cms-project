# Task 006: Notion 클라이언트 및 데이터 매퍼 구현

## 목적 및 배경

Phase 3의 핵심 기반 작업. Notion API를 통해 실제 리서치 데이터를 조회하는 클라이언트와 매퍼를 구현한다.
이 작업이 완료되면 Task 007~010에서 목 데이터 대신 실제 Notion 데이터를 사용할 수 있다.

## 관련 파일

- `lib/notion/constants.ts` — 수정 (SOURCE, EXPERT_BUY_PRICE 키 추가)
- `lib/notion/client.ts` — 신규 생성 (Notion 클라이언트 초기화)
- `lib/notion/mappers.ts` — 신규 생성 (Notion Page → Research 매퍼)
- `lib/notion/queries.ts` — 신규 생성 (리서치 조회 함수)
- `lib/schemas/research.ts` — 수정 (source, expertBuyPrice 필드 추가)
- `types/research.ts` — 참조 (Research, StockHistory)
- `lib/constants/cache.ts` — 참조 (CACHE_TAGS)

## 수락 기준

- `npm install @notionhq/client p-limit` 설치 완료
- `listResearches('ai')` 호출 시 `source: 'ai'`, `targetPrice` 필드가 있는 배열 반환
- `listResearches('expert')` 호출 시 `source: 'expert'`, `expertBuyPrice` 필드가 있는 배열 반환
- `getResearchById(id)` 존재하지 않는 ID 요청 시 `null` 반환
- `listResearchesByTicker(ticker)` 해당 ticker의 AI + Expert 통합 배열 반환
- Notion 토큰 미설정 시 서버 시작 시 명확한 에러 메시지
- TypeScript 컴파일 오류 없음

## 구현 단계

- [x] 1. 패키지 설치
  - `npm install @notionhq/client p-limit`
  - `package.json` 의존성 추가 확인

- [x] 2. `lib/notion/constants.ts` 수정
  - `NOTION_PROPERTIES`에 `SOURCE: 'source'`, `EXPERT_BUY_PRICE: 'expert_buy_price'` 추가
  - (이미 완료된 상태였음)

- [x] 3. `lib/notion/client.ts` 생성
  - `@notionhq/client` Client 초기화 — `NOTION_TOKEN` 환경 변수 주입
  - 환경 변수 누락 시 명시적 에러 throw
  - `NOTION_AI_DB_ID`, `NOTION_EXPERT_DB_ID` 환경 변수 export

- [x] 4. `lib/schemas/research.ts` 수정
  - `ResearchSchema`에 `source: z.enum(['ai', 'expert'])`, `expertBuyPrice: z.number().optional()` 추가
  - `targetPrice: z.number().optional()` 로 변경 (Expert는 targetPrice 없음)

- [x] 5. `lib/notion/mappers.ts` 생성
  - `mapAiPageToResearch(page: PageObjectResponse): Research` — AI DB 전용 (source: 'ai' 고정)
  - `mapExpertPageToResearch(page: PageObjectResponse): Research` — Expert DB 전용 (source: 'expert' 고정)
  - `NOTION_PROPERTIES` 상수를 사용해 각 프로퍼티 파싱
  - `opinion`: OPINION_MAP으로 한글 → BUY/HOLD/SELL 변환
  - source는 DB 구분에 따라 매퍼에서 자동 주입 (DB에 source 컬럼 없음)
  - `targetPrice`: Number 타입 파싱 (없으면 undefined)
  - `expertBuyPrice`: Number 타입 파싱 (없으면 undefined)
  - `publishedAt`: Date 파싱
  - `tags`: Multi-select 배열 파싱
  - 필수 필드 누락 시 에러 throw 대신 기본값 처리 (서비스 중단 방지)

- [x] 6. `lib/notion/queries.ts` 생성
  - `listResearches(source?: 'ai' | 'expert'): Promise<Research[]>`
    - filter: status = 'published' + published_at desc 정렬
    - p-limit(3) 동시성 제한 적용
  - `getAllResearches(): Promise<Research[]>` — AI + Expert 통합 (검색용)
  - `getResearchById(id: string): Promise<Research | null>` — ID로 단일 조회
  - `listResearchesByTicker(ticker: string): Promise<Research[]>` — ticker 기준 통합 조회 (source 무관)
  - **주의**: @notionhq/client v5 breaking change 대응
    - `databases.query` → `dataSources.query`
    - `database_id` → `data_source_id`

## 변경 사항 요약

- `@notionhq/client@5.20.0`, `p-limit` 패키지 추가
- `lib/notion/client.ts` 신규 생성 — Notion Client 초기화, 환경 변수 검증
- `lib/notion/mappers.ts` 신규 생성 — AI/Expert DB 페이지 → Research 타입 변환
- `lib/notion/queries.ts` 신규 생성 — 4개 조회 함수 (v5 API 대응)
- `lib/schemas/research.ts` 수정 — source, expertBuyPrice 필드 추가

## 테스트 체크리스트 (Playwright MCP)

- [ ] Notion 토큰 미설정 시 서버 시작 시 명확한 에러 반환
- [ ] 잘못된 DB ID 요청 시 500 에러 대신 빈 배열 반환
- [ ] AI 리서치 조회 응답에 `source: 'ai'`, `targetPrice` 필드 존재
- [ ] Expert 리서치 조회 응답에 `source: 'expert'`, `expertBuyPrice` 필드 존재
- [ ] p-limit 동시성 3 설정 하에 연속 호출 throttling 확인 (콘솔 로그로 검증)
