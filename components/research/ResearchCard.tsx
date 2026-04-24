'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { MarketCapBadge } from '@/components/research/MarketCapBadge'
import { formatPrice, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Research, Opinion } from '@/types/research'

interface ResearchCardProps {
  research: Research
}

/** 투자의견별 왼쪽 액센트 컬러 */
const OPINION_STRIP: Record<Opinion, string> = {
  BUY: 'bg-emerald-500',
  HOLD: 'bg-amber-400',
  SELL: 'bg-rose-500',
}

/** 리서치 목록에서 개별 항목을 카드 형태로 표시하는 컴포넌트 */
export function ResearchCard({ research }: ResearchCardProps) {
  const router = useRouter()

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl p-5 cursor-pointer',
        'bg-card border border-border/60',
        'shadow-sm hover:shadow-lg hover:-translate-y-0.5',
        'transition-all duration-200 ease-out overflow-hidden'
      )}
      onClick={() => router.push(`/research/${research.id}`)}
    >
      {/* 왼쪽 투자의견 액센트 스트립 */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-[3px]',
          OPINION_STRIP[research.opinion]
        )}
      />

      {/* 상단: 종목명 + 히스토리 아이콘 + 투자의견 배지 */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-0.5 min-w-0'>
          <div className='flex items-center gap-1.5 min-w-0'>
            <MarketCapBadge marketCap={research.marketCap} />
            <span className='font-bold text-base leading-tight truncate text-foreground'>
              {research.stockName}
            </span>
            <Link
              href={`/stocks/${research.ticker}`}
              onClick={(e) => e.stopPropagation()}
              className='text-muted-foreground/50 hover:text-primary shrink-0 transition-colors'
              title={`${research.stockName} 종목 히스토리`}
            >
              <BarChart2 className='size-3.5' />
            </Link>
          </div>
          <span className='text-muted-foreground text-xs font-mono'>
            {research.ticker}
            <span className='mx-1.5 opacity-40'>·</span>
            {research.sector}
          </span>
        </div>
        <OpinionBadge opinion={research.opinion} className='shrink-0 mt-0.5' />
      </div>

      {/* 중간: 목표가 + (전문가 매수가) + 발행일 */}
      <div className='flex items-end justify-between gap-2'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-xl font-bold tracking-tight text-foreground'>
            {formatPrice(research.targetPrice, research.currency)}
          </span>
          {research.expertBuyPrice != null && (
            <span className='text-xs text-amber-600 dark:text-amber-400 font-medium'>
              매수가 {formatPrice(research.expertBuyPrice, research.currency)}
            </span>
          )}
        </div>
        <span className='text-muted-foreground text-xs shrink-0 pb-0.5'>
          {formatDate(research.publishedAt)}
        </span>
      </div>

      {/* 하단: 요약 + 태그 */}
      <div className='flex flex-col gap-2.5'>
        <p className='text-sm line-clamp-2 text-muted-foreground leading-relaxed'>
          {research.summary}
        </p>
        {research.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {research.tags.map((tag) => (
              <Badge
                key={tag}
                variant='outline'
                className='text-xs px-2 py-0 h-5 bg-accent/40 border-border/50 text-muted-foreground'
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
