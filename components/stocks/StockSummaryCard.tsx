import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StockSummaryCardProps {
  stockName: string
  ticker: string
  sector: string
  researchCount: number
}

/** 종목 히스토리 페이지 상단에 표시되는 종목 기본 정보 카드 */
export function StockSummaryCard({
  stockName,
  ticker,
  sector,
  researchCount,
}: StockSummaryCardProps) {
  return (
    <Card>
      <CardContent className='py-5'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          {/* 종목명 + 티커 */}
          <div className='flex flex-col gap-1'>
            <h1 className='text-xl font-bold'>{stockName}</h1>
            <span className='text-sm text-muted-foreground font-mono'>
              {ticker}
            </span>
          </div>
          {/* 섹터 + 리서치 건수 */}
          <div className='flex items-center gap-2'>
            <Badge variant='outline'>{sector}</Badge>
            <span className='text-sm text-muted-foreground'>
              {researchCount}건의 리서치
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
