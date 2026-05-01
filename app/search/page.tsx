'use client'

import { useState } from 'react'
import type { Research } from '@/types/research'
import { SearchInput } from '@/components/search/SearchInput'
import { ResearchCard } from '@/components/research/ResearchCard'
import { ResearchCardSkeleton } from '@/components/research/ResearchCardSkeleton'
import { EmptyState } from '@/components/research/EmptyState'

export default function SearchPage() {
  const [results, setResults] = useState<Research[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleResults(data: Research[], query: string) {
    setResults(data)
    setCurrentQuery(query)
  }

  const hasQuery = currentQuery.trim() !== ''

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      {/* 페이지 제목 */}
      <h1 className='text-xl font-bold mb-4'>리서치 검색</h1>

      {/* 검색 인풋 */}
      <SearchInput onResults={handleResults} onLoadingChange={setIsLoading} />

      {/* 검색 결과 요약 */}
      {hasQuery && !isLoading && (
        <p className='mt-4 text-sm text-muted-foreground'>
          &ldquo;{currentQuery}&rdquo; 검색 결과{' '}
          <span className='font-semibold text-foreground'>{results.length}건</span>
        </p>
      )}

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <ResearchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 검색 결과 목록 */}
      {!isLoading && results.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {results.map((r) => (
            <ResearchCard key={r.id} research={r} />
          ))}
        </div>
      )}

      {/* 결과 없음 상태 */}
      {!isLoading && hasQuery && results.length === 0 && (
        <div className='mt-4'>
          <EmptyState />
        </div>
      )}

      {/* 초기 상태: 검색어 없을 때 안내 문구 */}
      {!isLoading && !hasQuery && (
        <p className='mt-8 text-sm text-muted-foreground text-center'>
          종목명, 티커, 또는 태그를 입력하세요.
        </p>
      )}
    </div>
  )
}
