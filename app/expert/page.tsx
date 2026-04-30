import { getMockResearches } from '@/lib/mocks/research'
import { ResearchCard } from '@/components/research/ResearchCard'
import { FilterBarWrapper } from '@/components/research/FilterBarWrapper'
import { EmptyState } from '@/components/research/EmptyState'

export const revalidate = 3600

interface ExpertPageProps {
  searchParams: Promise<{ sector?: string; tags?: string }>
}

export default async function ExpertPage({ searchParams }: ExpertPageProps) {
  const { sector, tags: tagsParam } = await searchParams

  const currentSector = sector || 'all'
  const currentTags = tagsParam ? tagsParam.split(',').filter(Boolean) : []

  const allResearches = getMockResearches('expert')

  const sectors = Array.from(new Set(allResearches.map((r) => r.sector))).sort()

  const sectorResearches =
    currentSector === 'all'
      ? allResearches
      : allResearches.filter((r) => r.sector === currentSector)

  const sectorTags = Array.from(
    new Set(sectorResearches.flatMap((r) => r.tags))
  ).sort()

  const filtered = allResearches
    .filter((r) => {
      if (currentSector !== 'all' && r.sector !== currentSector) return false
      if (currentTags.length > 0) {
        return currentTags.some((tag) => r.tags.includes(tag))
      }
      return true
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight'>Expert Research</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          전문가의 종목 분석 및 매수 추천 아카이브
        </p>
      </div>

      <FilterBarWrapper
        sectors={sectors}
        tags={sectorTags}
        currentSector={currentSector}
        currentTags={currentTags}
      />

      {(currentSector !== 'all' || currentTags.length > 0) && (
        <p className='text-sm text-muted-foreground mt-4'>
          필터 결과{' '}
          <span className='font-semibold text-foreground'>{filtered.length}건</span>
        </p>
      )}

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
