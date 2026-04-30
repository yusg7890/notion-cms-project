'use client'

import { useRouter } from 'next/navigation'
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

/** source별 카드 컨테이너 스타일 */
const CARD_BASE: Record<string, string> = {
  ai: [
    'border border-violet-200/80 dark:border-violet-700/40',
    'bg-gradient-to-br from-violet-50/60 to-card dark:from-violet-950/25 dark:to-card',
  ].join(' '),
  expert: [
    'border border-amber-200/80 dark:border-amber-700/40',
    'bg-gradient-to-br from-amber-50/60 to-card dark:from-amber-950/25 dark:to-card',
  ].join(' '),
}

/** source별 카드 상단 레이블 */
const CARD_LABEL: Record<string, { text: string; cls: string }> = {
  ai: {
    text: 'AI 분석',
    cls: 'text-violet-600/80 dark:text-violet-400/70',
  },
  expert: {
    text: '전문가 의견',
    cls: 'text-amber-600/80 dark:text-amber-400/70',
  },
}

/** source별 가격 레이블("목표가" / "매수가") 테두리 배지 스타일 */
const PRICE_LABEL: Record<string, string> = {
  ai: 'border border-violet-400/60 dark:border-violet-500/50 text-violet-700 dark:text-violet-300',
  expert: 'border border-amber-400/60 dark:border-amber-500/50 text-amber-700 dark:text-amber-300',
}

/** source별 태그 배지 스타일 */
const TAG_BADGE: Record<string, string> = {
  ai: 'bg-violet-100/60 dark:bg-violet-900/30 border-violet-200/60 dark:border-violet-700/40 text-violet-800 dark:text-violet-300',
  expert: 'bg-amber-100/60 dark:bg-amber-900/30 border-amber-200/60 dark:border-amber-700/40 text-amber-800 dark:text-amber-300',
}

/** 리서치 목록에서 개별 항목을 카드 형태로 표시하는 컴포넌트 */
export function ResearchCard({ research }: ResearchCardProps) {
  const router = useRouter()
  const src = research.source ?? 'ai'

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl p-5 cursor-pointer',
        CARD_BASE[src] ?? CARD_BASE.ai,
        'shadow-sm hover:shadow-lg hover:-translate-y-0.5',
        'transition-all duration-200 ease-out overflow-hidden'
      )}
      onClick={() => router.push(`/research/${research.id}`)}
    >
      {/* 왼쪽 투자의견 액센트 스트립 — AI·Expert 동일 */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-[3px]',
          OPINION_STRIP[research.opinion]
        )}
      />

      {/* 상단: 소스 레이블 + 종목명 / 날짜 + 투자의견 배지 */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-0.5 min-w-0'>
          <span className={cn('text-[10px] font-semibold tracking-wide', CARD_LABEL[src]?.cls)}>
            {CARD_LABEL[src]?.text}
          </span>
          <div className='flex items-center gap-1.5 min-w-0'>
            <MarketCapBadge marketCap={research.marketCap} />
            <span className='font-bold text-base leading-tight truncate text-foreground'>
              {research.stockName}
            </span>
          </div>
          <span className='text-muted-foreground text-xs font-mono'>
            {research.ticker}
            <span className='mx-1.5 opacity-40'>·</span>
            {research.sector}
          </span>
        </div>
        {/* 날짜 위, 투자의견 배지 아래 */}
        <div className='flex flex-col items-end gap-1 shrink-0'>
          <span className='text-[11px] text-muted-foreground'>
            {formatDate(research.publishedAt)}
          </span>
          <OpinionBadge opinion={research.opinion} />
        </div>
      </div>

      {/* 중간: 가격 레이블(테두리) + 가격 숫자 */}
      <div className='flex flex-col gap-1'>
        <span className={cn(
          'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide',
          PRICE_LABEL[src] ?? PRICE_LABEL.ai
        )}>
          {src === 'expert' ? '매수가' : '목표가'}
        </span>
        <span className='text-xl font-bold tracking-tight text-foreground'>
          {src === 'expert'
            ? (research.expertBuyPrice != null
                ? formatPrice(research.expertBuyPrice, research.currency)
                : '-')
            : (research.targetPrice != null
                ? formatPrice(research.targetPrice, research.currency)
                : '-')}
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
                className={cn('text-xs px-2 py-0 h-5', TAG_BADGE[src] ?? TAG_BADGE.ai)}
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
