'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import ZoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'react-chartjs-2'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import type { Research, Opinion } from '@/types/research'
import { formatDate, formatPrice } from '@/lib/formatters'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, ZoomPlugin)

interface HistoryChartProps {
  researches: Research[]
  highlightId?: string
  /** 화살표 라벨을 표시할 데이터셋 — 'target': 목표가(AI), 'expert': 전문가 매수가 */
  highlightLine?: 'target' | 'expert'
}

const DEFAULT_WINDOW = 10

/** 가격 범위에 따라 적절한 Y축 단계 크기 반환 */
function getNiceStep(range: number, isKRW: boolean): number {
  if (isKRW) {
    if (range > 50_000) return 10_000
    if (range > 10_000) return 5_000
    if (range > 2_000) return 1_000
    if (range > 1_000) return 500
    return 100
  } else {
    if (range > 500) return 100
    if (range > 200) return 50
    if (range > 100) return 20
    if (range > 50) return 10
    if (range > 20) return 5
    if (range > 10) return 2
    if (range > 5) return 1
    return 0.5
  }
}

interface ChartPoint {
  index: number
  date: string
  /** targetPrice 없는 Expert 리서치는 null — 차트에서 gap으로 처리 */
  price: number | null
  /** expertBuyPrice 없는 AI 리서치는 null — 차트에서 gap으로 처리 */
  expertBuyPrice: number | null
  id: string
  opinion: Opinion
  currency: 'KRW' | 'USD'
}

export function HistoryChart({ researches, highlightId, highlightLine = 'target' }: HistoryChartProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  const uniqueCurrencies = useMemo(
    () => [...new Set(researches.map((r) => r.currency))],
    [researches]
  )

  const points = useMemo(
    (): ChartPoint[] =>
      researches.map((r, i) => ({
        index: i,
        date: formatDate(r.publishedAt).replace(/^\d{2}(\d{2})/, '$1'),
        price: r.targetPrice ?? null,
        expertBuyPrice: r.expertBuyPrice ?? null,
        id: r.id,
        opinion: r.opinion,
        currency: r.currency,
      })),
    [researches]
  )

  const highlightIndex = highlightId != null
    ? points.findIndex((p) => p.id === highlightId)
    : -1

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (uniqueCurrencies.length > 1) {
    return (
      <div className='rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
        통화 단위가 혼재(KRW/USD)하여 차트를 표시할 수 없습니다.
        각 통화 기준의 목표가를 비교하려면 아래 리서치 목록을 참조하세요.
      </div>
    )
  }

  if (!isMounted) {
    return <div className='w-full h-[300px] rounded-md bg-muted animate-pulse' />
  }

  const isDark = resolvedTheme === 'dark'
  const axisColor = isDark ? '#475569' : '#94a3b8'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const dotStroke = isDark ? '#ffffff' : '#475569'
  const isKRW = uniqueCurrencies[0] === 'KRW'
  const hasTargetPrice = points.some((d) => d.price != null)
  const hasExpertBuyPrice = points.some((d) => d.expertBuyPrice != null)

  const startIndex = Math.max(0, points.length - DEFAULT_WINDOW)
  const endIndex = points.length - 1

  // 초기 뷰포트 범위로 step 결정, 전체 데이터로 Y 도메인 확보
  const allPrices = points.flatMap((d) =>
    [d.price, d.expertBuyPrice].filter((v): v is number => v != null)
  )
  const visiblePrices = points
    .slice(startIndex, endIndex + 1)
    .flatMap((d) => [d.price, d.expertBuyPrice].filter((v): v is number => v != null))

  const safeVisible = visiblePrices.length > 0 ? visiblePrices : allPrices
  const safeAll = allPrices.length > 0 ? allPrices : [0, 100]

  const visibleRange = Math.max(...safeVisible) - Math.min(...safeVisible)
  const step = getNiceStep(visibleRange || Math.max(...safeVisible), isKRW)

  const allLo = Math.min(...safeAll)
  const allHi = Math.max(...safeAll)
  let yMin = Math.floor(allLo / step) * step
  let yMax = Math.ceil(allHi / step) * step

  // 데이터가 격자선에 딱 걸리면 한 step 여백 추가
  if (allLo === yMin) yMin -= step
  if (allHi === yMax) yMax += step

  const yTicks: number[] = []
  for (let i = 0; yMin + i * step <= yMax + step * 0.0001; i++) {
    yTicks.push(yMin + i * step)
  }

  const data: ChartData<'line', { x: number; y: number | null }[]> = {
    datasets: [
      ...(hasTargetPrice
        ? [
            {
              label: '목표가',
              data: points.map((d) => ({ x: d.index, y: d.price })),
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f6',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 2,
              pointBorderColor: dotStroke,
              pointBackgroundColor: '#3b82f6',
              pointHoverBorderColor: dotStroke,
              tension: 0,
              spanGaps: true,
            },
          ]
        : []),
      ...(hasExpertBuyPrice
        ? [
            {
              label: '전문가 매수가',
              data: points.map((d) => ({ x: d.index, y: d.expertBuyPrice })),
              borderColor: '#fbbf24',
              backgroundColor: '#fbbf24',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 2,
              pointBorderColor: dotStroke,
              pointBackgroundColor: '#fbbf24',
              pointHoverBorderColor: dotStroke,
              tension: 0,
              spanGaps: true,
            },
          ]
        : []),
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    onClick: (_event, elements) => {
      if (elements.length === 0) return
      const idx = elements[0].index
      const p = points[idx]
      if (p) router.push(`/research/${p.id}`)
    },
    scales: {
      x: {
        type: 'linear',
        min: startIndex - 0.5,
        max: endIndex + 0.5,
        afterBuildTicks(scale) {
          const start = Math.ceil(scale.min)
          const end = Math.floor(scale.max)
          const ticks = []
          for (let i = start; i <= end; i++) {
            if (points[i] != null) ticks.push({ value: i })
          }
          scale.ticks = ticks
        },
        ticks: {
          maxRotation: 30,
          minRotation: 30,
          align: 'end',
          color: axisColor,
          font: { size: 11 },
          callback(value) {
            const n = value as number
            return points[n]?.date ?? null
          },
        },
        grid: { color: gridColor },
        border: { color: axisColor },
      },
      y: {
        type: 'linear',
        min: yMin,
        max: yMax,
        afterBuildTicks(scale) {
          scale.ticks = yTicks.map((v) => ({ value: v }))
        },
        title: {
          display: true,
          text: isKRW ? '(원)' : '(달러)',
          color: axisColor,
          font: { size: 10 },
          align: 'end',
        },
        ticks: {
          color: axisColor,
          font: { size: 11 },
          callback: (value) => {
            const v = value as number
            return isKRW
              ? v.toLocaleString('ko-KR')
              : v.toLocaleString('en-US', { maximumFractionDigits: 2 })
          },
        },
        grid: { color: gridColor },
        border: { color: axisColor },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => points[items[0]?.dataIndex]?.date ?? '',
          label: (item) => {
            const p = points[item.dataIndex]
            if (!p) return ''
            const label = item.dataset.label
            if (label === '목표가' && p.price != null)
              return ` 목표가: ${formatPrice(p.price, p.currency)}`
            if (label === '전문가 매수가' && p.expertBuyPrice != null)
              return ` 전문가 매수가: ${formatPrice(p.expertBuyPrice, p.currency)}`
            return ''
          },
        },
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        titleColor: isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        limits: {
          x: {
            min: -0.5,
            max: points.length - 0.5,
            minRange: 2,
            maxRange: points.length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
    },
  }

  const highlightPlugin: Plugin<'line'> = {
    id: 'selectedMarker',
    afterDraw(chart) {
      if (highlightIndex < 0) return
      const { ctx, chartArea, scales } = chart
      const x = scales.x?.getPixelForValue(highlightIndex)
      if (x == null || x < chartArea.left || x > chartArea.right) return
      const pt = points[highlightIndex]
      const rawY = highlightLine === 'expert'
        ? (pt.expertBuyPrice ?? pt.price)
        : (pt.price ?? pt.expertBuyPrice)
      if (rawY == null) return
      const priceY = scales.y?.getPixelForValue(rawY)
      if (priceY == null) return

      ctx.save()

      const label = '현재 페이지'
      const fontSize = 11
      const padX = 8
      const padY = 4
      const triH = 7
      const gap = 6

      ctx.font = `600 ${fontSize}px system-ui,-apple-system,sans-serif`
      const textW = ctx.measureText(label).width
      const boxW = textW + padX * 2
      const boxH = fontSize + padY * 2

      // 기본 위치: 점 위 / 공간 부족 시 점 아래로 뒤집기
      const above = priceY - gap - triH - boxH >= chartArea.top
      const boxTop = above
        ? priceY - gap - triH - boxH
        : priceY + gap + triH
      const boxBottom = boxTop + boxH
      const arrowBaseY = above ? boxBottom : boxTop
      const arrowTipY = above ? priceY - gap : priceY + gap

      // 수평 중앙 정렬 — 차트 영역 안으로 클램핑
      let labelX = x
      if (x - boxW / 2 < chartArea.left) labelX = chartArea.left + boxW / 2
      if (x + boxW / 2 > chartArea.right) labelX = chartArea.right - boxW / 2
      const boxLeft = labelX - boxW / 2

      const accent = '#3b82f6'

      // 라벨 박스 (둥근 사각형)
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.roundRect(boxLeft, boxTop, boxW, boxH, 4)
      ctx.fill()

      // 화살표 삼각형 (박스 → 데이터 점 방향)
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.moveTo(labelX - 5, arrowBaseY)
      ctx.lineTo(labelX + 5, arrowBaseY)
      ctx.lineTo(x, arrowTipY)
      ctx.closePath()
      ctx.fill()

      // 텍스트
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, labelX, boxTop + boxH / 2)

      ctx.restore()
    },
  }

  return (
    <div className='w-full'>
      {/* 범례 */}
      <div className='flex items-center justify-between mb-3 px-1'>
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          {hasTargetPrice && (
            <div className='flex items-center gap-1.5'>
              <span className='inline-block w-5 h-0.5 bg-blue-500 rounded' />
              <span>목표가</span>
            </div>
          )}
          {hasExpertBuyPrice && (
            <div className='flex items-center gap-1.5'>
              <span className='inline-block w-5 h-0.5 rounded' style={{ backgroundColor: '#fbbf24' }} />
              <span>전문가 매수가</span>
            </div>
          )}
        </div>
        {points.length > DEFAULT_WINDOW && (
          <span className='text-[11px] text-muted-foreground/50 select-none'>
            드래그 이동 · 스크롤 줌
          </span>
        )}
      </div>

      <div style={{ height: '300px' }}>
        <Line data={data} options={options} plugins={[highlightPlugin]} />
      </div>
    </div>
  )
}
