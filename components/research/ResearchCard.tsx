'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { formatPrice, formatDate } from '@/lib/formatters'
import type { Research } from '@/types/research'

interface ResearchCardProps {
  research: Research
}

/** 리서치 목록에서 개별 항목을 카드 형태로 표시하는 컴포넌트 */
export function ResearchCard({ research }: ResearchCardProps) {
  const router = useRouter()

  return (
    <Card
      className='h-full hover:shadow-md transition-shadow cursor-pointer'
      onClick={() => router.push(`/research/${research.id}`)}
    >
      <CardContent className='flex flex-col gap-3 py-4'>
        {/* 상단: 종목명 + 티커 + 투자의견 배지 */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5 min-w-0'>
            {/* 종목명 클릭 시 종목 히스토리 페이지로 이동 (카드 클릭 이벤트 전파 차단) */}
            <Link
              href={`/stocks/${research.ticker}`}
              onClick={(e) => e.stopPropagation()}
              className='font-semibold text-base leading-tight hover:underline truncate'
            >
              {research.stockName}
            </Link>
            <span className='text-muted-foreground text-xs'>
              {research.ticker}
            </span>
          </div>
          <OpinionBadge opinion={research.opinion} className='shrink-0' />
        </div>

        {/* 중간: 목표가 + 발행일 */}
        <div className='flex items-center justify-between gap-2'>
          <span className='text-lg font-bold'>
            {formatPrice(research.targetPrice, research.currency)}
          </span>
          <span className='text-muted-foreground text-sm shrink-0'>
            {formatDate(research.publishedAt)}
          </span>
        </div>

        {/* 하단: 요약 + 태그 목록 */}
        <div className='flex flex-col gap-2'>
          <p className='text-sm line-clamp-2 text-foreground/80'>
            {research.summary}
          </p>
          {research.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {research.tags.map((tag) => (
                <Badge key={tag} variant='outline' className='text-xs'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
