import { cn } from '@/lib/utils'
import type { MarketCap } from '@/types/research'

const SHORT_LABEL: Record<MarketCap, string> = {
  large: '대',
  mid: '중',
  small: '소',
}

const FULL_LABEL: Record<MarketCap, string> = {
  large: '대형주',
  mid: '중형주',
  small: '소형주',
}

const STYLE: Record<MarketCap, string> = {
  large: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-500/25',
  mid: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/25',
  small: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/25',
}

interface MarketCapBadgeProps {
  marketCap: MarketCap
  /** true: '대형주' / false(기본): '대' */
  full?: boolean
  className?: string
}

export function MarketCapBadge({ marketCap, full = false, className }: MarketCapBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        STYLE[marketCap],
        className
      )}
    >
      {full ? FULL_LABEL[marketCap] : SHORT_LABEL[marketCap]}
    </span>
  )
}
