import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StockSummaryCardProps {
  stockName: string
  ticker: string
  sector: string
  researchCount: number
}

/** 종목 기본 정보 요약 카드 */
export function StockSummaryCard({
  stockName,
  ticker,
  sector,
  researchCount,
}: StockSummaryCardProps) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <CardTitle className='text-xl'>{stockName}</CardTitle>
            <p className='mt-0.5 text-sm text-muted-foreground'>{ticker}</p>
          </div>
          <Badge variant='secondary'>{sector}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          총 <span className='font-medium text-foreground'>{researchCount}건</span>의 리서치
        </p>
      </CardContent>
    </Card>
  )
}
