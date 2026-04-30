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

  const allResearches = getMockResearches('ai')

  // 고유 섹터 목록 추출 (FilterBar 옵션용)
  const sectors = Array.from(
    new Set(allResearches.map((r) => r.sector))
  ).sort()

  // 선택된 섹터 기준으로 태그 목록 추출 (섹터 변경 시 관련 태그만 표시)
  const sectorResearches =
    currentSector === 'all'
      ? allResearches
      : allResearches.filter((r) => r.sector === currentSector)

  const sectorTags = Array.from(
    new Set(sectorResearches.flatMap((r) => r.tags))
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
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      {/* 페이지 제목 */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight'>리서치 아카이브</h1>
        <p className='text-sm text-muted-foreground mt-1'>AI가 생성한 종목 분석 리서치를 시계열로 추적합니다</p>
      </div>

      {/* 섹터/태그 필터 바 */}
      <FilterBarWrapper
        sectors={sectors}
        tags={sectorTags}
        currentSector={currentSector}
        currentTags={currentTags}
      />

      {/* 필터 적용 중일 때 결과 건수 표시 */}
      {(currentSector !== 'all' || currentTags.length > 0) && (
        <p className='text-sm text-muted-foreground mt-4'>
          필터 결과{' '}
          <span className='font-semibold text-foreground'>{filtered.length}건</span>
        </p>
      )}

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
