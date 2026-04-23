'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/** 최근 검색어 localStorage 키 */
const RECENT_SEARCHES_KEY = 'recent-searches'
/** 저장할 최근 검색어 최대 개수 */
const MAX_RECENT_SEARCHES = 5

/** localStorage에서 최근 검색어 목록 읽기 */
function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? (JSON.parse(stored) as string[]) : []
  } catch {
    return []
  }
}

/** 최근 검색어 목록에 새 검색어 추가 후 저장 */
function saveRecentSearch(term: string): void {
  const recent = getRecentSearches().filter((t) => t !== term)
  const updated = [term, ...recent].slice(0, MAX_RECENT_SEARCHES)
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // localStorage 접근 불가 환경에서는 무시
  }
}

/** 종목명/태그 키워드 검색 인풋 — URL searchParams 와 연동 */
export function SearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQuery = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)
  const [recentSearches, setRecentSearches] = useState<string[]>(
    () => (typeof window !== 'undefined' ? getRecentSearches() : [])
  )

  /** 검색 실행: URL push + 최근 검색어 저장 */
  function executeSearch(term: string) {
    const trimmed = term.trim()
    if (!trimmed) return
    saveRecentSearch(trimmed)
    setRecentSearches(getRecentSearches())
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  /** Enter 키 입력 시 검색 실행 */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      executeSearch(inputValue)
    }
  }

  /** 최근 검색어 배지 클릭 */
  function handleRecentClick(term: string) {
    setInputValue(term)
    executeSearch(term)
  }

  const showRecentSearches =
    inputValue.trim() === '' && recentSearches.length > 0

  return (
    <div className='flex flex-col gap-3'>
      <Input
        type='search'
        placeholder='종목명 또는 태그로 검색 (예: 삼성전자, HBM)'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label='리서치 검색'
        className='h-10 text-sm'
      />

      {/* 최근 검색어 목록 — 인풋이 비어있을 때만 표시 */}
      {showRecentSearches && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-xs text-muted-foreground'>최근 검색:</span>
          {recentSearches.map((term) => (
            <Badge
              key={term}
              variant='outline'
              className='cursor-pointer text-xs hover:bg-muted'
              onClick={() => handleRecentClick(term)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRecentClick(term)
                }
              }}
            >
              {term}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
