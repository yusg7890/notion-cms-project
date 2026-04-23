import { Suspense } from 'react'
import { EmptyState } from '@/components/research/EmptyState'
import { FilterBar } from '@/components/research/FilterBar'
import { ResearchCard } from '@/components/research/ResearchCard'
import { ResearchCardSkeleton } from '@/components/research/ResearchCardSkeleton'
import { getMockResearches } from '@/lib/mocks/research'

export const revalidate = 3600

interface HomePageProps {
  searchParams: Promise<{ sector?: string; tags?: string }>
}

function extractSectors(researches: ReturnType<typeof getMockResearches>): string[] {
  return Array.from(new Set(researches.map((r) => r.sector))).sort()
}

function extractTags(researches: ReturnType<typeof getMockResearches>): string[] {
  const tagSet = new Set<string>()
  researches.forEach((r) => r.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { sector, tags } = await searchParams

  const allResearches = getMockResearches()
  const currentSector = sector ?? 'all'
  const currentTags = tags ? tags.split(',').filter(Boolean) : []

  // 섹터 + 태그 서버 필터링
  const filtered = allResearches
    .filter((r) => currentSector === 'all' || r.sector === currentSector)
    .filter(
      (r) =>
        currentTags.length === 0 || currentTags.some((tag) => r.tags.includes(tag)),
    )
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  const sectors = extractSectors(allResearches)
  const allTags = extractTags(allResearches)

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold tracking-tight'>리서치 아카이브</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          AI가 생성한 종목 분석 리서치를 탐색하세요.
        </p>
      </div>

      {/* 필터 영역 */}
      <div className='mb-6'>
        <Suspense fallback={null}>
          <FilterBar
            sectors={sectors}
            tags={allTags}
            currentSector={currentSector}
            currentTags={currentTags}
          />
        </Suspense>
      </div>

      {/* 결과 건수 */}
      <p className='mb-4 text-sm text-muted-foreground'>
        {filtered.length}건의 리서치
      </p>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((research) => (
            <ResearchCard key={research.id} research={research} />
          ))}
        </div>
      )}
    </div>
  )
}

/** 로딩 중 스켈레톤 그리드 (loading.tsx에서 사용 가능) */
export function ResearchGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <ResearchCardSkeleton key={i} />
      ))}
    </div>
  )
}
