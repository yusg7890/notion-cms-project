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
}: {
  researches: Research[]
  highlightId?: string
}) {
  return <HistoryChartDynamic researches={researches} highlightId={highlightId} />
}
