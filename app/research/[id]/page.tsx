import { getResearchById, listResearchesByTicker } from '@/lib/notion/queries'
import { getPageMarkdown } from '@/lib/notion/content'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/formatters'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { MarketCapBadge } from '@/components/research/MarketCapBadge'
import { ResearchCard } from '@/components/research/ResearchCard'
import { MarkdownRenderer } from '@/components/research/MarkdownRenderer'
import { Badge } from '@/components/ui/badge'
import { HistoryChartLazy as HistoryChart } from '@/components/stocks/HistoryChartLazy'
import type { Metadata } from 'next'

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const research = await getResearchById(id)
  return {
    title: research ? `${research.stockName} 리서치` : '리서치',
    robots: { index: false, follow: false },
  }
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const research = await getResearchById(id)

  if (!research) {
    notFound()
  }

  const [historyResearches, markdown] = await Promise.all([
    listResearchesByTicker(research.ticker),
    getPageMarkdown(id),
  ])

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
          {/* 가격 정보: source에 따라 목표가 또는 전문가 매수가 표시 */}
          <div className='flex items-end gap-6'>
            {research.source === 'expert' ? (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>전문가 매수가</span>
                <span className='text-xl font-bold text-amber-500'>
                  {research.expertBuyPrice != null
                    ? formatPrice(research.expertBuyPrice, research.currency)
                    : '-'}
                </span>
              </div>
            ) : (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>목표가</span>
                <span className='text-xl font-bold'>
                  {research.targetPrice != null
                    ? formatPrice(research.targetPrice, research.currency)
                    : '-'}
                </span>
              </div>
            )}
          </div>
          {/* 발행일 + 출처 */}
          <div className='flex flex-col gap-1 text-sm text-muted-foreground sm:text-right'>
            <span>발행일: {formatDate(research.publishedAt)}</span>
            <span>
              {research.source === 'expert' ? '증권사: ' : '분석 모델: '}
              {research.aiModel}
            </span>
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
            highlightLine={research.source === 'expert' ? 'expert' : 'target'}
          />
        </div>
      </section>

      {/* 본문 영역 — Notion 페이지 본문 */}
      <MarkdownRenderer content={markdown} />

      {/* 인라인 면책 문구 */}
      <aside className='mt-8 rounded-lg border border-muted bg-muted/30 px-4 py-3 text-sm text-muted-foreground'>
        본 분석은 AI(Claude)가 생성한 개인 학습 기록이며, 투자 권유가 아닙니다. 투자 결과에 대한 책임은 전적으로 투자자 본인에게 있습니다.
      </aside>

      {/* 하단: 동일 종목 리서치 목록 */}
      {relatedResearches.length > 0 && (
        <section className='mt-10 pt-8 border-t'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-semibold'>
              {research.stockName} 리서치 히스토리
            </h2>
            <a
              href={`/stocks/${research.ticker}`}
              className='text-sm text-muted-foreground hover:text-foreground underline underline-offset-2'
            >
              이 종목의 모든 리서치 보기 →
            </a>
          </div>
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
