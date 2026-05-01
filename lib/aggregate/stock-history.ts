import type { Research, StockHistory, Currency } from '@/types/research'

export type StockHistoryWithMeta = StockHistory & { hasCurrencyMismatch: boolean }

/**
 * Research 배열을 StockHistory로 집계
 * @returns 데이터가 없으면 null
 */
export function buildStockHistory(researches: Research[]): StockHistoryWithMeta | null {
  if (researches.length === 0) return null

  const first = researches[0]
  const currencies = [...new Set(researches.map((r) => r.currency))]
  const hasCurrencyMismatch = currencies.length > 1
  const currency: Currency = currencies[0]

  const sorted = [...researches].sort(
    (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime()
  )

  return {
    ticker: first.ticker,
    stockName: first.stockName,
    sector: first.sector,
    currency,
    researches: sorted,
    hasCurrencyMismatch,
  }
}
