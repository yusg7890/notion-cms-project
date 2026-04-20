# AI Stock Research Archive

Notion을 CMS로 활용한 AI 기반 개인 투자 리서치 아카이브.
Claude가 종목을 분석하고 Notion DB에 저장하면, 웹에서 종목별 시계열로 투자의견·목표가 변화를 추적할 수 있다.

> **개인 학습 기록용 프로젝트입니다. 투자 권유 목적이 아닙니다.**

## 주요 기능

- **리서치 목록**: 발행된 리서치를 최신순 카드 그리드로 표시, 섹터/태그 필터
- **상세 페이지**: Notion 페이지 본문 렌더링 + 동일 종목 이전 리서치 링크
- **종목 히스토리**: 동일 종목 리서치 시계열 목록 + 목표가/투자의견 변화 차트
- **검색**: 종목명·태그 키워드 검색

## AI 분석 플로우

```
1. Claude(Notion MCP 연결)에 "삼성전자 분석해줘" 요청
2. Claude가 분석 수행 → Notion DB에 리서치 페이지 생성 (상태: draft)
3. Notion에서 내용 검토 후 status → 'published' 로 변경
4. POST /api/revalidate 호출 → 웹에 즉시 반영
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.2.4 (App Router) |
| 언어 | TypeScript, React 19 |
| CMS | Notion API (`@notionhq/client`) |
| 본문 렌더링 | `react-notion-x` 또는 `notion-to-md` |
| 차트 | Recharts |
| 배포 | Vercel |

## 시작하기

### 환경 변수 설정

```bash
cp .env.example .env.local
```

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
REVALIDATE_SECRET=...
NEXT_PUBLIC_SITE_INDEXABLE=false  # 검색엔진 색인 차단 (기본값)
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

### Notion DB 스키마

| Property Key | 타입 | 설명 |
|---|---|---|
| `title` | Title | 리서치 제목 |
| `stock_name` | Text | 종목명 (히스토리 추적 키) |
| `ticker` | Text | 종목 코드 |
| `sector` | Select | 산업 섹터 |
| `tags` | Multi-select | 분류 태그 |
| `opinion` | Select | `매수` / `관망` / `매도` |
| `target_price` | Number | 목표가 (Claude 자동 산정) |
| `currency` | Select | `KRW` / `USD` |
| `summary` | Text | 한 줄 요약 |
| `published_at` | Date | 발행일 |
| `status` | Select | `draft` / `published` |
| `ai_model` | Text | 예: `Claude Opus 4.7` |

## 문서

- [PRD](./docs/PRD.md) — 전체 요구사항 명세
- [검증 결과](./docs/valid.md) — PRD 기술 검증 리포트

## 면책 고지

본 프로젝트는 AI가 생성한 투자 분석을 개인 기록·학습 목적으로 아카이빙하는 도구입니다.
목표가·투자의견은 Claude의 추론 결과이며, 실제 투자 의사결정의 근거로 사용해서는 안 됩니다.
