'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MouseHandlerDataParam } from 'recharts/types/synchronisation/types'
import { useRouter } from 'next/navigation'
import type { Research, Opinion } from '@/types/research'
import { formatDate, formatPrice } from '@/lib/formatters'

interface HistoryChartProps {
  /** publishedAt 오름차순으로 정렬된 리서치 배열 */
  researches: Research[]
}

/** 투자의견 코드 → 한글 텍스트 */
const OPINION_LABELS: Record<Opinion, string> = {
  BUY: '매수',
  HOLD: '관망',
  SELL: '매도',
}

interface ChartDataPoint {
  date: string
  price: number
  id: string
  opinion: Opinion
  summary: string
  currency: 'KRW' | 'USD'
}

/** 커스텀 툴팁 컴포넌트 */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className='rounded-lg border bg-background p-3 shadow-md text-sm max-w-[200px]'>
      <p className='font-semibold mb-1'>{data.date}</p>
      <p className='text-blue-600 font-bold'>
        {formatPrice(data.price, data.currency)}
      </p>
      <p className='text-muted-foreground mt-1'>
        투자의견: {OPINION_LABELS[data.opinion]}
      </p>
      <p className='text-muted-foreground text-xs mt-1 line-clamp-2'>
        {data.summary}
      </p>
    </div>
  )
}

/** 종목 목표가 변화 시계열 라인 차트 */
export function HistoryChart({ researches }: HistoryChartProps) {
  const router = useRouter()

  // 통화 혼재 감지
  const uniqueCurrencies = [...new Set(researches.map((r) => r.currency))]
  if (uniqueCurrencies.length > 1) {
    return (
      <div className='rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
        통화 단위가 혼재(KRW/USD)하여 차트를 표시할 수 없습니다.
        각 통화 기준의 목표가를 비교하려면 아래 리서치 목록을 참조하세요.
      </div>
    )
  }

  const chartData: ChartDataPoint[] = researches.map((r) => ({
    date: formatDate(r.publishedAt),
    price: r.targetPrice,
    id: r.id,
    opinion: r.opinion,
    summary: r.summary,
    currency: r.currency,
  }))

  /**
   * 차트 클릭 시 activeTooltipIndex를 통해 해당 리서치 상세 페이지로 이동
   * recharts 3.x에서는 onClick이 MouseHandlerDataParam을 첫 번째 인자로 받음
   */
  function handleChartClick(nextState: MouseHandlerDataParam) {
    const index = nextState?.activeTooltipIndex
    if (typeof index === 'number' && chartData[index]) {
      router.push(`/research/${chartData[index].id}`)
    }
  }

  return (
    <div className='w-full'>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          data={chartData}
          onClick={handleChartClick}
          style={{ cursor: 'pointer' }}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              uniqueCurrencies[0] === 'KRW'
                ? `${(value / 10000).toFixed(0)}만`
                : `$${value}`
            }
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type='monotone'
            dataKey='price'
            stroke='#2563eb'
            strokeWidth={2}
            dot={{ r: 5, cursor: 'pointer', fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
