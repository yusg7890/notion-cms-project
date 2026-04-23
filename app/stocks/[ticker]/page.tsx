import { notFound } from 'next/navigation'
import { HistoryChart } from '@/components/stocks/HistoryChart'
import { StockSummaryCard } from '@/components/stocks/StockSummaryCard'
import { ResearchCard } from '@/components/research/ResearchCard'
import { getMockStockHistory } from '@/lib/mocks/research'

export const revalidate = 3600

interface StockHistoryPageProps {
  params: Promise<{ ticker: string }>
}

export default async function StockHistoryPage({ params }: StockHistoryPageProps) {
  const { ticker } = await params
  const history = getMockStockHistory(ticker)

  if (!history) notFound()

  const { stockName, sector, researches } = history
  // 차트: publishedAt 오름차순, 타임라인: 내림차순
  const timeline = [...researches].reverse()

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      {/* 종목 기본 정보 */}
      <div className='mb-6'>
        <StockSummaryCard
          stockName={stockName}
          ticker={ticker}
          sector={sector}
          researchCount={researches.length}
        />
      </div>

      {/* 목표가 시계열 차트 */}
      <div className='mb-8'>
        <h2 className='mb-3 text-sm font-semibold text-muted-foreground'>목표가 변화</h2>
        <HistoryChart researches={researches} />
      </div>

      {/* 리서치 타임라인 */}
      <div>
        <h2 className='mb-4 text-sm font-semibold text-muted-foreground'>
          리서치 타임라인 ({researches.length}건)
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {timeline.map((research) => (
            <ResearchCard key={research.id} research={research} />
          ))}
        </div>
      </div>
    </div>
  )
}
