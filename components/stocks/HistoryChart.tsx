'use client'

import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatDate, formatPrice } from '@/lib/formatters'
import type { Research } from '@/types/research'

interface HistoryChartProps {
  researches: Research[]
}

interface ChartDataPoint {
  id: string
  date: string
  targetPrice: number
  opinion: string
  summary: string
  currency: Research['currency']
}

const OPINION_LABEL: Record<string, string> = {
  BUY: '매수',
  HOLD: '관망',
  SELL: '매도',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  return (
    <div className='max-w-xs rounded-lg border border-border bg-background p-3 shadow-md text-sm'>
      <p className='font-medium'>{data.date}</p>
      <p className='mt-1 text-muted-foreground'>
        목표가: <span className='font-medium text-foreground'>{formatPrice(data.targetPrice, data.currency)}</span>
      </p>
      <p className='text-muted-foreground'>
        의견: <span className='font-medium text-foreground'>{OPINION_LABEL[data.opinion] ?? data.opinion}</span>
      </p>
      <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>{data.summary}</p>
    </div>
  )
}

/** 종목 목표가 변화를 시계열 라인 차트로 표시 (recharts, 클라이언트 컴포넌트) */
export function HistoryChart({ researches }: HistoryChartProps) {
  const router = useRouter()

  // 통화 혼재 여부 확인
  const currencies = new Set(researches.map((r) => r.currency))
  if (currencies.size > 1) {
    return (
      <div className='flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800'>
        이 종목의 리서치에 KRW와 USD가 혼재되어 있어 차트를 표시할 수 없습니다.
      </div>
    )
  }

  const currency = researches[0]?.currency ?? 'KRW'
  const data: ChartDataPoint[] = researches.map((r) => ({
    id: r.id,
    date: formatDate(r.publishedAt),
    targetPrice: r.targetPrice,
    opinion: r.opinion,
    summary: r.summary,
    currency,
  }))

  function handleChartClick(chartData: unknown) {
    const payload = (chartData as { activePayload?: Array<{ payload: ChartDataPoint }> })
      ?.activePayload
    const id = payload?.[0]?.payload?.id
    if (id) router.push(`/research/${id}`)
  }

  return (
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          onClick={handleChartClick as Parameters<typeof LineChart>[0]['onClick']}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              currency === 'KRW'
                ? `${(v / 1000).toFixed(0)}k`
                : `$${v}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type='monotone'
            dataKey='targetPrice'
            stroke='var(--primary)'
            strokeWidth={2}
            dot={{ r: 5, cursor: 'pointer', fill: 'var(--primary)' }}
            activeDot={{ r: 7, cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
