import { getMockStockHistory } from '@/lib/mocks/research'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/formatters'
import { HistoryChartLazy as HistoryChart } from '@/components/stocks/HistoryChartLazy'
import { StockSummaryCard } from '@/components/stocks/StockSummaryCard'
import { ResearchCard } from '@/components/research/ResearchCard'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import type { Research } from '@/types/research'

export const revalidate = 3600

export default async function StockHistoryPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const stockHistory = getMockStockHistory(ticker)

  if (!stockHistory) {
    notFound()
  }

  const { stockName, sector, currency, researches } = stockHistory

  // 차트용: publishedAt 오름차순 (getMockStockHistory에서 이미 정렬됨)
  const sortedAsc: Research[] = researches

  // 리서치 목록용: publishedAt 내림차순
  const sortedDesc: Research[] = [...researches].sort(
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
        <div className='rounded-lg border p-4 bg-background'>
          <HistoryChart researches={sortedAsc} />
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
            {sortedAsc.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.publishedAt)}</td>
                <td>{formatPrice(r.targetPrice, currency)}</td>
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
          {sortedAsc.map((r) => (
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
