import { Suspense } from 'react'
import { FilterBar } from './FilterBar'
import { Skeleton } from '@/components/ui/skeleton'

interface FilterBarWrapperProps {
  sectors: string[]
  tags: string[]
  currentSector: string
  currentTags: string[]
}

/** FilterBar 로딩 상태 폴백 */
function FilterBarFallback() {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-7 w-36 rounded-md' />
      </div>
      <div className='flex flex-wrap gap-1.5'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-5 w-14 rounded-md' />
        ))}
      </div>
    </div>
  )
}

/**
 * useSearchParams를 사용하는 FilterBar를 Suspense 경계로 감싸는 래퍼.
 * Next.js에서 useSearchParams는 반드시 Suspense 안에서 사용해야 한다.
 */
export function FilterBarWrapper(props: FilterBarWrapperProps) {
  return (
    <Suspense fallback={<FilterBarFallback />}>
      <FilterBar {...props} />
    </Suspense>
  )
}
