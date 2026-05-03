'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
  sectors: string[]
  tags: string[]
  currentSector: string
  currentTags: string[]
}

/** 섹터 Select와 태그 버튼으로 리서치 목록을 필터링하는 클라이언트 컴포넌트 */
export function FilterBar({
  sectors,
  tags,
  currentSector,
  currentTags,
}: FilterBarProps) {
  const router = useRouter()

  /** URL을 새 sector/tags 값으로 업데이트하는 헬퍼 */
  const pushUrl = useCallback(
    (sector: string, selectedTags: string[]) => {
      const params = new URLSearchParams()
      if (sector && sector !== 'all') params.set('sector', sector)
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
      const query = params.toString()
      router.push(query ? `/?${query}` : '/')
    },
    [router]
  )

  /** 섹터 변경 핸들러 — 섹터 변경 시 태그 선택 초기화 */
  const handleSectorChange = useCallback(
    (value: string) => {
      pushUrl(value, [])
    },
    [pushUrl]
  )

  /** 태그 토글 핸들러 — 선택된 태그는 제거, 미선택 태그는 추가 (OR 조건) */
  const handleTagToggle = useCallback(
    (tag: string) => {
      const next = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag]
      pushUrl(currentSector, next)
    },
    [pushUrl, currentSector, currentTags]
  )

  /** 모든 필터 초기화 핸들러 */
  const handleReset = useCallback(() => {
    router.push('/')
  }, [router])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const hasFilter =
    (currentSector && currentSector !== 'all') || currentTags.length > 0

  return (
    <div className='flex flex-col gap-3'>
      {/* 섹터 필터 + 초기화 버튼 행 */}
      <div className='flex items-center gap-2 flex-wrap'>
        {mounted ? (
          <Select
            value={currentSector || 'all'}
            onValueChange={handleSectorChange}
          >
            <SelectTrigger className='w-36'>
              <SelectValue placeholder='섹터 선택' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>전체 섹터</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className='h-7 w-36 rounded-md bg-muted animate-pulse' />
        )}

        {hasFilter && (
          <Button variant='ghost' size='sm' onClick={handleReset}>
            초기화
          </Button>
        )}
      </div>

      {/* 태그 멀티 선택 버튼 행 */}
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => {
            const isSelected = currentTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={
                  isSelected
                    ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors bg-primary text-primary-foreground shadow-sm'
                    : 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border border-border/70 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-accent/40'
                }
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
