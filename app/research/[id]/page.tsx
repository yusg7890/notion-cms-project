import { getMockResearchById, getMockStockHistory } from '@/lib/mocks/research'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/formatters'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { MarketCapBadge } from '@/components/research/MarketCapBadge'
import { ResearchCard } from '@/components/research/ResearchCard'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HistoryChartLazy as HistoryChart } from '@/components/stocks/HistoryChartLazy'

export const revalidate = 86400

/** Notion 연동 전 임시 더미 본문 마크다운 */
const DUMMY_CONTENT = `
## 투자 의견 요약

AI 분석 결과 해당 종목은 현재 반도체 업황 회복 사이클 진입과 함께 AI 인프라 수요 확대라는 구조적 성장 요인을 보유하고 있습니다.

## 목표가 산정 근거

**PER 기반 밸류에이션** 적용:
- 2026년 예상 EPS 기준 PER 15배 적용
- 동종업계 평균 PER 대비 15% 할인 반영
- HBM 부문 성장 프리미엄 20% 가산

\`\`\`
목표가 = EPS(추정) × PER 배수 × 프리미엄 계수
\`\`\`

## 주요 성장 동인

1. **HBM 시장 점유율 확대** — AI 서버 수요 급증으로 HBM 공급 부족 현상 지속
2. **파운드리 수주 회복** — 3nm 공정 수율 개선으로 고객사 확대
3. **스마트폰 사이클 반등** — 프리미엄 플래그십 판매 호조

## 주요 리스크

- 거시경제 불확실성 및 글로벌 경기 침체 가능성
- 미중 무역 갈등 심화에 따른 수출 규제 리스크
- 경쟁사(TSMC, 마이크론) 공격적 투자 확대

## 불확실성 및 분석 한계

- 본 분석에 사용된 재무 데이터의 기준 시점 이후 발생한 이벤트는 반영되지 않았습니다.
- EPS 추정치는 AI 모델의 추론에 기반하며 실제 값과 상이할 수 있습니다.
- 글로벌 거시경제 변수(금리, 환율 등)는 단순 가정값을 적용하였습니다.

## 면책 문구

본 분석은 AI가 생성한 개인 학습 기록이며, 투자 권유가 아닙니다.
`

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const research = getMockResearchById(id)

  if (!research) {
    notFound()
  }

  const stockHistory = getMockStockHistory(research.ticker)
  const historyResearches = stockHistory?.researches ?? [research]

  // 차트용: 오름차순 / 카드 목록용: 내림차순, 현재 리서치 제외
  const relatedResearches = [...historyResearches]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .filter((r) => r.id !== research.id)

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      {/* 헤더 영역 */}
      <div className='border-b pb-6 mb-6'>
        <h1 className='text-2xl font-bold'>{research.stockName}</h1>
        <div className='flex items-center gap-2 mt-2 flex-wrap'>
          <span className='text-sm text-muted-foreground font-mono'>
            {research.ticker}
          </span>
          <Badge variant='outline'>{research.sector}</Badge>
          <MarketCapBadge marketCap={research.marketCap} full />
          <OpinionBadge opinion={research.opinion} />
        </div>
      </div>

      {/* 메타 정보 카드 */}
      <div className='bg-muted/50 rounded-lg p-4 mb-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          {/* 목표가 + 전문가 매수가 */}
          <div className='flex items-end gap-6'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs text-muted-foreground'>목표가</span>
              <span className='text-xl font-bold'>
                {formatPrice(research.targetPrice, research.currency)}
              </span>
            </div>
            {research.expertBuyPrice != null && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>전문가 매수가</span>
                <span className='text-xl font-bold text-amber-500'>
                  {formatPrice(research.expertBuyPrice, research.currency)}
                </span>
              </div>
            )}
          </div>
          {/* 발행일 + AI 모델 */}
          <div className='flex flex-col gap-1 text-sm text-muted-foreground sm:text-right'>
            <span>발행일: {formatDate(research.publishedAt)}</span>
            <span>분석 모델: {research.aiModel}</span>
          </div>
        </div>
        {/* 태그 목록 */}
        {research.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50'>
            {research.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 목표가 추이 차트 */}
      <section className='mb-6'>
        <h2 className='text-base font-semibold mb-3'>목표가 추이</h2>
        <div className='rounded-lg border p-4 bg-background'>
          <HistoryChart
            researches={historyResearches}
            highlightId={research.id}
            highlightLine={research.source === 'strategist' ? 'expert' : 'target'}
          />
        </div>
      </section>

      {/* 본문 영역 — Notion 연동 전 더미 마크다운 */}
      <article className='prose max-w-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className='text-lg font-semibold mt-8 mb-3 pb-1 border-b'>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-base font-semibold mt-6 mb-2'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='text-sm leading-7 mb-4 text-foreground/80'>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc list-inside mb-4 space-y-1 text-sm text-foreground/80'>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal list-inside mb-4 space-y-1 text-sm text-foreground/80'>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className='leading-6'>{children}</li>
            ),
            code: ({ children }) => (
              <code className='bg-muted px-1.5 py-0.5 rounded text-xs font-mono'>
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className='bg-muted rounded-md p-4 overflow-x-auto mb-4 text-xs font-mono'>
                {children}
              </pre>
            ),
            strong: ({ children }) => (
              <strong className='font-semibold text-foreground'>{children}</strong>
            ),
          }}
        >
          {DUMMY_CONTENT}
        </ReactMarkdown>
      </article>

      {/* 하단: 동일 종목 리서치 목록 */}
      {relatedResearches.length > 0 && (
        <section className='mt-10 pt-8 border-t'>
          <h2 className='text-base font-semibold mb-4'>
            {research.stockName} 리서치 히스토리
          </h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {relatedResearches.map((r) => (
              <ResearchCard key={r.id} research={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
