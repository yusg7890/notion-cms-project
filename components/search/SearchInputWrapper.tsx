'use client'

import { Suspense } from 'react'
import { SearchInput } from './SearchInput'

/** useSearchParams 사용을 위한 Suspense 래퍼 */
export function SearchInputWrapper() {
  return (
    <Suspense
      fallback={
        <div className='h-10 rounded-md border bg-muted animate-pulse' />
      }
    >
      <SearchInput />
    </Suspense>
  )
}
