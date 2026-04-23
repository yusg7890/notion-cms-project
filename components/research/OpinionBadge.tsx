import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Opinion } from '@/types/research'

interface OpinionBadgeProps {
  opinion: Opinion
  className?: string
}

const OPINION_STYLE: Record<Opinion, string> = {
  BUY: 'bg-green-100 text-green-800 border-green-200',
  HOLD: 'bg-amber-100 text-amber-800 border-amber-200',
  SELL: 'bg-red-100 text-red-800 border-red-200',
}

const OPINION_LABEL: Record<Opinion, string> = {
  BUY: '매수',
  HOLD: '관망',
  SELL: '매도',
}

/** 투자의견(BUY/HOLD/SELL)에 따라 색상이 다른 Badge */
export function OpinionBadge({ opinion, className }: OpinionBadgeProps) {
  return (
    <Badge
      variant='outline'
      className={cn(OPINION_STYLE[opinion], 'font-medium', className)}
    >
      {OPINION_LABEL[opinion]}
    </Badge>
  )
}
