import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Opinion } from '@/types/research'

interface OpinionBadgeProps {
  opinion: Opinion
  className?: string
}

/** 투자의견별 색상 클래스 매핑 */
const OPINION_STYLES: Record<Opinion, string> = {
  BUY: 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-100',
  HOLD: 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100',
  SELL: 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100',
}

/** 투자의견 코드 → 한글 텍스트 매핑 */
const OPINION_LABELS: Record<Opinion, string> = {
  BUY: '매수',
  HOLD: '관망',
  SELL: '매도',
}

/** 투자의견(BUY/HOLD/SELL)을 한글 배지로 표시하는 컴포넌트 */
export function OpinionBadge({ opinion, className }: OpinionBadgeProps) {
  return (
    <Badge
      className={cn(OPINION_STYLES[opinion], className)}
    >
      {OPINION_LABELS[opinion]}
    </Badge>
  )
}
