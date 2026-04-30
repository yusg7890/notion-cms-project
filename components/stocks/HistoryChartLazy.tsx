'use client'

import dynamic from 'next/dynamic'
import type { Research } from '@/types/research'

const HistoryChartDynamic = dynamic(
  () => import('./HistoryChart').then((m) => m.HistoryChart),
  { ssr: false }
)

export function HistoryChartLazy({
  researches,
  highlightId,
  highlightLine,
}: {
  researches: Research[]
  highlightId?: string
  highlightLine?: 'target' | 'expert'
}) {
  return (
    <HistoryChartDynamic
      researches={researches}
      highlightId={highlightId}
      highlightLine={highlightLine}
    />
  )
}
