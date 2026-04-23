import { Suspense } from 'react'
import { EmptyState } from '@/components/research/EmptyState'
import { ResearchCard } from '@/components/research/ResearchCard'
import { SearchInput } from '@/components/search/SearchInput'
import { getMockResearches } from '@/lib/mocks/research'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const allResearches = getMockResearches()

  // 종목명·티커·태그 기준 필터링 (대소문자 무시)
  const results = query
    ? allResearches.filter((r) => {
        const lq = query.toLowerCase()
        return (
          r.stockName.toLowerCase().includes(lq) ||
          r.ticker.toLowerCase().includes(lq) ||
          r.tags.some((tag) => tag.toLowerCase().includes(lq))
        )
      })
    : []

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold tracking-tight'>검색</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          종목명, 티커, 태그로 리서치를 검색하세요.
        </p>
      </div>

      {/* 검색 입력 */}
      <div className='mb-8'>
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
      </div>

      {/* 검색 결과 */}
      {query && (
        <>
          <p className='mb-4 text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>&quot;{query}&quot;</span> 검색 결과{' '}
            {results.length}건
          </p>
          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {results.map((research) => (
                <ResearchCard key={research.id} research={research} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
