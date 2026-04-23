import { getMockResearches } from '@/lib/mocks/research'
import { ResearchCard } from '@/components/research/ResearchCard'
import { FilterBarWrapper } from '@/components/research/FilterBarWrapper'
import { EmptyState } from '@/components/research/EmptyState'

export const revalidate = 3600

interface HomePageProps {
  searchParams: Promise<{ sector?: string; tags?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { sector, tags: tagsParam } = await searchParams

  const currentSector = sector || 'all'
  const currentTags = tagsParam
    ? tagsParam.split(',').filter(Boolean)
    : []

  const allResearches = getMockResearches()

  // 고유 섹터 목록 추출 (FilterBar 옵션용)
  const sectors = Array.from(
    new Set(allResearches.map((r) => r.sector))
  ).sort()

  // 고유 태그 목록 추출 (FilterBar 버튼용)
  const allTags = Array.from(
    new Set(allResearches.flatMap((r) => r.tags))
  ).sort()

  // 서버 사이드 필터링 — sector + tags OR 조건
  const filtered = allResearches
    .filter((r) => {
      if (currentSector !== 'all' && r.sector !== currentSector) return false
      if (currentTags.length > 0) {
        return currentTags.some((tag) => r.tags.includes(tag))
      }
      return true
    })
    // publishedAt 내림차순 명시적 정렬 (getMockResearches가 이미 정렬하지만 방어적 적용)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      {/* 페이지 제목 */}
      <h1 className='text-2xl font-bold mb-6'>리서치 아카이브</h1>

      {/* 섹터/태그 필터 바 */}
      <FilterBarWrapper
        sectors={sectors}
        tags={allTags}
        currentSector={currentSector}
        currentTags={currentTags}
      />

      {/* 리서치 카드 그리드 또는 빈 상태 */}
      {filtered.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
          {filtered.map((research) => (
            <ResearchCard key={research.id} research={research} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
