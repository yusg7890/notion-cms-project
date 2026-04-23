'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const STORAGE_KEY = 'recent-searches'
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const prev = getRecentSearches()
  const next = [query, ...prev.filter((q) => q !== query)].slice(0, MAX_RECENT)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

/** 검색 입력 컴포넌트 (최근 검색어 + URL searchParams 동기화) */
export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQ = searchParams.get('q') ?? ''

  const [value, setValue] = useState(currentQ)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  function handleSubmit(query: string) {
    const trimmed = query.trim()
    if (!trimmed) {
      router.push('/search')
      return
    }
    saveRecentSearch(trimmed)
    setRecentSearches(getRecentSearches())
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit(value)
  }

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          ref={inputRef}
          type='search'
          placeholder='종목명, 티커, 태그로 검색...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label='리서치 검색'
          className='max-w-lg'
        />
      </div>

      {/* 최근 검색어 (검색어 없을 때 표시) */}
      {!currentQ && recentSearches.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-xs text-muted-foreground'>최근 검색:</span>
          {recentSearches.map((q) => (
            <button key={q} onClick={() => { setValue(q); handleSubmit(q) }}>
              <Badge variant='outline' className='cursor-pointer text-xs hover:bg-muted'>
                {q}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
