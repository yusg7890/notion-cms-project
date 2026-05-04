# Claude → Notion 저장 규칙 (F010)

Claude가 Notion MCP로 리서치를 저장할 때 반드시 준수해야 할 실무 체크리스트.

---

## 저장 전 체크리스트

### 공통 필수 필드

- [ ] `title` — `[종목명] 리서치 - YYYY-MM-DD` 형식
- [ ] `stock_name` — 정확한 공식 종목명 (히스토리 추적 키, 동일 종목은 항상 동일 이름 사용)
- [ ] `ticker` — 국내 6자리 숫자(`005930`) 또는 해외 알파벳 티커(`AAPL`)
- [ ] `opinion` — `매수` / `관망` / `매도` 중 정확히 하나 (한글 고정)
- [ ] `currency` — `KRW` 또는 `USD` (영문 대문자 고정)
- [ ] `summary` — 50자 이내 한 줄 요약
- [ ] `published_at` — 분석 수행 날짜 (ISO 8601 형식, 예: `2026-05-03`)
- [ ] `status` — 반드시 `draft`로 저장 (발행은 사용자가 직접 변경)

### AI Research 전용 필드 (AI DB에 저장 시)

- [ ] `target_price` — 목표가 숫자만 (통화 기호 없이, 예: `95000`)
- [ ] `ai_model` — 사용한 Claude 모델명 (예: `Claude Opus 4.7`)
- [ ] `expert_buy_price` — 비워둠

### Expert Research 전용 필드 (Expert DB에 저장 시)

- [ ] `expert_buy_price` — 전문가 매수가 숫자만 (통화 기호 없이)
- [ ] `ai_model` — 증권사·분석가명 (예: `삼성증권`, `Goldman Sachs`)
- [ ] `target_price` — 비워둠

### 선택 필드

- [ ] `sector` — 산업 섹터 (예: `반도체`, `IT`)
- [ ] `tags` — 분류 태그 (Multi-select, 예: `성장주`, `배당`)

---

## Notion DB Property Key 일람 (대소문자·띄어쓰기 정확히 일치 필수)

| Property Key | 타입 | DB |
|---|---|---|
| `title` | Title | AI / Expert |
| `stock_name` | Rich Text | AI / Expert |
| `ticker` | Rich Text | AI / Expert |
| `sector` | Select | AI / Expert |
| `tags` | Multi-select | AI / Expert |
| `opinion` | Select | AI / Expert |
| `target_price` | Number | AI |
| `expert_buy_price` | Number | Expert |
| `currency` | Select | AI / Expert |
| `summary` | Rich Text | AI / Expert |
| `published_at` | Date | AI / Expert |
| `status` | Select | AI / Expert |
| `ai_model` | Rich Text | AI / Expert |

---

## Select 옵션 상수 (코드 내 매핑)

```typescript
// lib/notion/constants.ts 참고
OPINION_MAP: { '매수': 'BUY', '관망': 'HOLD', '매도': 'SELL' }
STATUS: { DRAFT: 'draft', PUBLISHED: 'published' }
CURRENCY: { KRW: 'KRW', USD: 'USD' }
```

---

## 본문 필수 포함 사항 (AI Research)

1. **목표가 산정 근거** — 밸류에이션 방법(PER/PBR/DCF)과 적용 수치 명시
2. **분석 기준 날짜** — "2026년 1분기 실적 기준" 등 데이터 기준일 명시
3. **불확실성 언급** — AI 분석 한계 및 데이터 부재 항목 명시
4. **면책 문구** — "본 분석은 AI가 생성한 개인 학습 기록이며, 투자 권유가 아닙니다."
5. **블록 수 제한 준수** — Notion API 페이로드 한도: 블록 1,000개, 텍스트 2,000자 이내

---

## 저장 후 발행 절차

1. Notion DB에서 저장된 페이지 내용 검토
2. 필수 Property 모두 정상 입력 확인
3. `status` 속성을 `published`로 변경
4. `POST /api/revalidate?secret=[TOKEN]` 호출하여 캐시 갱신
