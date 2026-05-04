import { cn } from '@/lib/utils'
import type { Opinion } from '@/types/research'

interface OpinionBadgeProps {
  opinion: Opinion
  className?: string
}

const OPINION_STYLES: Record<Opinion, string> = {
  BUY: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
  HOLD: 'bg-amber-400/15 text-amber-700 dark:text-amber-400 border border-amber-400/30',
  SELL: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25',
}

const OPINION_DOT: Record<Opinion, string> = {
  BUY: 'bg-emerald-500',
  HOLD: 'bg-amber-400',
  SELL: 'bg-rose-500',
}

const OPINION_LABELS: Record<Opinion, string> = {
  BUY: '매수',
  HOLD: '관망',
  SELL: '매도',
}

export function OpinionBadge({ opinion, className }: OpinionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        OPINION_STYLES[opinion],
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', OPINION_DOT[opinion])} />
      {OPINION_LABELS[opinion]}
    </span>
  )
}
