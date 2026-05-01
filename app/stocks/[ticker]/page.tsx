import { listResearchesByTicker } from '@/lib/notion/queries'
import { buildStockHistory } from '@/lib/aggregate/stock-history'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/formatters'
import { HistoryChartLazy as HistoryChart } from '@/components/stocks/HistoryChartLazy'
import { StockSummaryCard } from '@/components/stocks/StockSummaryCard'
import { ResearchCard } from '@/components/research/ResearchCard'
import { OpinionBadge } from '@/components/research/OpinionBadge'

export const revalidate = 3600

export default async function StockHistoryPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const rawResearches = await listResearchesByTicker(ticker)
  const stockHistory = buildStockHistory(rawResearches)

  if (!stockHistory) {
    notFound()
  }

  const { stockName, sector, currency, researches, hasCurrencyMismatch } = stockHistory

  // 리서치 목록용: publishedAt 내림차순
  const sortedDesc = [...researches].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8 space-y-6'>
      {/* 종목 기본 정보 카드 */}
      <StockSummaryCard
        stockName={stockName}
        ticker={ticker}
        sector={sector}
        researchCount={researches.length}
      />

      {/* 목표가 변화 차트 */}
      <section aria-label='목표가 변화 차트'>
        <h2 className='text-base font-semibold mb-3'>목표가 추이</h2>
        {hasCurrencyMismatch && (
          <div className='mb-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800'>
            이 종목의 리서치에 KRW/USD 통화 단위가 혼재합니다. 차트를 표시할 수 없습니다.
          </div>
        )}
        <div className='rounded-lg border p-4 bg-background'>
          <HistoryChart researches={researches} />
        </div>

        {/* 접근성용 숨김 테이블 */}
        <table className='sr-only'>
          <caption>목표가 변화 데이터</caption>
          <thead>
            <tr>
              <th scope='col'>날짜</th>
              <th scope='col'>목표가</th>
              <th scope='col'>투자의견</th>
              <th scope='col'>요약</th>
            </tr>
          </thead>
          <tbody>
            {researches.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.publishedAt)}</td>
                <td>{r.targetPrice != null ? formatPrice(r.targetPrice, currency) : '-'}</td>
                <td>{r.opinion}</td>
                <td>{r.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 투자의견 변화 타임라인 */}
      <section aria-label='투자의견 변화 타임라인'>
        <h2 className='text-base font-semibold mb-3'>투자의견 변화</h2>
        <div className='flex flex-wrap gap-2'>
          {researches.map((r) => (
            <div
              key={r.id}
              className='flex items-center gap-1.5 rounded-full border bg-background px-3 py-1'
            >
              <span className='text-xs text-muted-foreground'>
                {formatDate(r.publishedAt)}
              </span>
              <OpinionBadge opinion={r.opinion} />
            </div>
          ))}
        </div>
      </section>

      {/* 리서치 히스토리 목록 */}
      <section aria-label='리서치 히스토리'>
        <h2 className='text-base font-semibold mb-3'>리서치 히스토리</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {sortedDesc.map((r) => (
            <ResearchCard key={r.id} research={r} />
          ))}
        </div>
      </section>
    </div>
  )
}
