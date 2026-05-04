/** Notion DB Property Key — 대소문자·띄어쓰기 포함 정확히 일치해야 함 */
export const NOTION_PROPERTIES = {
  // 공통 컬럼 (AI DB · Expert DB 모두)
  TITLE: 'title',
  STOCK_NAME: 'stock_name',
  TICKER: 'ticker',
  SECTOR: 'sector',
  TAGS: 'tags',
  OPINION: 'opinion',
  CURRENCY: 'currency',
  SUMMARY: 'summary',
  PUBLISHED_AT: 'published_at',
  STATUS: 'status',
  // AI DB 전용
  TARGET_PRICE: 'target_price',
  AI_MODEL: 'ai_model',
  // Expert DB 전용
  EXPERT_BUY_PRICE: 'expert_buy_price',
  FIRM: 'firm',
} as const

/** Notion DB opinion Select 옵션(한글) → 코드 내부 enum 매핑 */
export const OPINION_MAP = {
  '매수': 'BUY',
  '관망': 'HOLD',
  '매도': 'SELL',
} as const

export type OpinionLabel = keyof typeof OPINION_MAP
export type OpinionCode = (typeof OPINION_MAP)[OpinionLabel]

/** Notion DB status Select 옵션값 (영문 소문자 고정) */
export const STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

/** Notion DB currency Select 옵션값 */
export const CURRENCY = {
  KRW: 'KRW',
  USD: 'USD',
} as const
