export type Opinion = 'BUY' | 'HOLD' | 'SELL'
export type Currency = 'KRW' | 'USD'
export type ResearchStatus = 'draft' | 'published'
export type MarketCap = 'large' | 'mid' | 'small'

export type ResearchSource = 'ai' | 'strategist'

export interface Research {
  id: string
  title: string
  stockName: string
  ticker: string
  sector: string
  tags: string[]
  opinion: Opinion
  marketCap: MarketCap
  targetPrice: number
  expertBuyPrice?: number
  currency: Currency
  summary: string
  publishedAt: Date
  status: ResearchStatus
  aiModel: string
  source?: ResearchSource
}

export interface StockHistory {
  ticker: string
  stockName: string
  sector: string
  /** 통화 단위가 혼재할 경우 차트 렌더링 불가 — currency 필드로 단일 통화 여부 체크 */
  currency: Currency
  researches: Research[]
}
