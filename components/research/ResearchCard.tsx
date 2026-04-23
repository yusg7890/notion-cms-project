import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { formatDate, formatPrice } from '@/lib/formatters'
import type { Research } from '@/types/research'

interface ResearchCardProps {
  research: Research
}

/** 리서치 한 건을 카드 형태로 표시하는 컴포넌트 */
export function ResearchCard({ research }: ResearchCardProps) {
  const {
    id,
    stockName,
    ticker,
    sector,
    tags,
    opinion,
    targetPrice,
    currency,
    summary,
    publishedAt,
  } = research

  return (
    <Link href={`/research/${id}`} className='group block h-full'>
      <Card className='h-full transition-shadow hover:shadow-md'>
        <CardHeader className='pb-2'>
          {/* 종목명 + 티커 + 투자의견 */}
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0 flex-1'>
              {/* 종목명 클릭 시 종목 히스토리 페이지로 이동 */}
              <Link
                href={`/stocks/${ticker}`}
                onClick={(e) => e.stopPropagation()}
                className='text-sm font-semibold leading-tight hover:underline'
              >
                {stockName}
              </Link>
              <p className='mt-0.5 text-xs text-muted-foreground'>{ticker}</p>
            </div>
            <OpinionBadge opinion={opinion} className='shrink-0' />
          </div>

          {/* 목표가 + 발행일 */}
          <div className='mt-2 flex items-center justify-between text-sm'>
            <span className='font-medium'>{formatPrice(targetPrice, currency)}</span>
            <span className='text-xs text-muted-foreground'>{formatDate(publishedAt)}</span>
          </div>
        </CardHeader>

        <CardContent className='pb-4'>
          {/* 요약 (2줄 truncate) */}
          <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>{summary}</p>

          {/* 섹터 + 태그 목록 */}
          <div className='flex flex-wrap gap-1'>
            <Badge variant='secondary' className='text-xs'>
              {sector}
            </Badge>
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
