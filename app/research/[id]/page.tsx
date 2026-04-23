import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { OpinionBadge } from '@/components/research/OpinionBadge'
import { formatDate, formatPrice } from '@/lib/formatters'
import { getMockResearchById } from '@/lib/mocks/research'

export const revalidate = 86400

interface ResearchPageProps {
  params: Promise<{ id: string }>
}

/** 더미 마크다운 본문 (Task 008에서 Notion 실제 본문으로 교체) */
const DUMMY_BODY = `
## 투자의견 요약

본 분석은 최근 공개된 재무 데이터와 산업 트렌드를 바탕으로 작성되었습니다.

## 밸류에이션 분석

### PER 기반 적정 주가

- 2026년 예상 EPS: 기준값 활용
- 적용 PER: 업종 평균 대비 프리미엄 적용
- 적정 주가: 목표가 산정

### 리스크 요인

1. 글로벌 경기 둔화에 따른 수요 감소 가능성
2. 경쟁사의 신기술 개발 및 시장 진입
3. 환율 변동 리스크

## 결론

현재 주가 수준은 중장기 성장 가치 대비 저평가 구간으로 판단되며, 분할 매수 전략을 권장합니다.

---

*본 분석은 AI(Claude)가 생성한 개인 학습·기록 목적의 아카이브입니다. 투자 권유가 아닙니다.*
`

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { id } = await params
  const research = getMockResearchById(id)

  if (!research) notFound()

  const {
    stockName,
    ticker,
    sector,
    tags,
    opinion,
    targetPrice,
    currency,
    publishedAt,
    aiModel,
  } = research

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      {/* 헤더 메타 정보 */}
      <div className='mb-8'>
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <Badge variant='secondary'>{sector}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant='outline' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className='text-2xl font-bold tracking-tight'>{stockName}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{ticker}</p>

        <div className='mt-4 flex flex-wrap items-center gap-4'>
          <OpinionBadge opinion={opinion} />
          <span className='text-lg font-semibold'>{formatPrice(targetPrice, currency)}</span>
          <span className='text-sm text-muted-foreground'>{formatDate(publishedAt)}</span>
        </div>

        <p className='mt-2 text-xs text-muted-foreground'>분석 모델: {aiModel}</p>
      </div>

      {/* 본문 (react-markdown) — Task 008에서 Notion 실제 본문으로 교체 */}
      <div className='prose prose-sm max-w-none text-foreground [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-medium [&_li]:text-sm [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{DUMMY_BODY}</ReactMarkdown>
      </div>

      {/* 종목 히스토리 링크 */}
      <div className='mt-10 border-t border-border pt-6'>
        <Link
          href={`/stocks/${ticker}`}
          className='text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80'
        >
          이 종목의 모든 리서치 보기 →
        </Link>
      </div>
    </div>
  )
}
