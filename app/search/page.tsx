import { getAllMockResearches } from '@/lib/mocks/research'
import { SearchInputWrapper } from '@/components/search/SearchInputWrapper'
import { ResearchCard } from '@/components/research/ResearchCard'
import { EmptyState } from '@/components/research/EmptyState'

/** 검색은 매 요청마다 최신 결과 반영 */
export const revalidate = 0

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const allResearches = getAllMockResearches()

  // 검색어가 있을 때 종목명·티커·태그 기준으로 필터링 (대소문자 무시)
  const filtered = q
    ? allResearches.filter((r) => {
        const query = q.toLowerCase()
        return (
          r.stockName.toLowerCase().includes(query) ||
          r.ticker.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      })
    : []

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      {/* 페이지 제목 */}
      <h1 className='text-xl font-bold mb-4'>리서치 검색</h1>

      {/* 검색 인풋 */}
      <SearchInputWrapper />

      {/* 검색 결과 요약 */}
      {q && (
        <p className='mt-4 text-sm text-muted-foreground'>
          &ldquo;{q}&rdquo; 검색 결과{' '}
          <span className='font-semibold text-foreground'>{filtered.length}건</span>
        </p>
      )}

      {/* 결과 목록 또는 빈 상태 */}
      {filtered.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {filtered.map((r) => (
            <ResearchCard key={r.id} research={r} />
          ))}
        </div>
      ) : q ? (
        <div className='mt-4'>
          <EmptyState />
        </div>
      ) : null}

      {/* 초기 상태: 검색어 없을 때 안내 문구 */}
      {!q && (
        <p className='mt-8 text-sm text-muted-foreground text-center'>
          종목명, 티커, 또는 태그를 입력하고 Enter를 누르세요.
        </p>
      )}
    </div>
  )
}
