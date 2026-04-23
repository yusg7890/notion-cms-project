'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
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

/** 섹터 Select + 태그 멀티 버튼 필터 (URL searchParams 동기화) */
export function FilterBar({ sectors, tags, currentSector, currentTags }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateUrl(sector: string, selectedTags: string[]) {
    const params = new URLSearchParams(searchParams.toString())

    if (sector && sector !== 'all') {
      params.set('sector', sector)
    } else {
      params.delete('sector')
    }

    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    } else {
      params.delete('tags')
    }

    router.push(`/?${params.toString()}`)
  }

  function handleSectorChange(value: string) {
    updateUrl(value, currentTags)
  }

  function handleTagToggle(tag: string) {
    const next = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]
    updateUrl(currentSector, next)
  }

  function handleReset() {
    router.push('/')
  }

  const hasFilter = currentSector !== 'all' || currentTags.length > 0

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-3'>
        {/* 섹터 Select */}
        <Select value={currentSector} onValueChange={handleSectorChange}>
          <SelectTrigger className='w-36'>
            <SelectValue placeholder='섹터' />
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

        {/* 필터 초기화 버튼 */}
        {hasFilter && (
          <Button variant='ghost' size='sm' onClick={handleReset}>
            초기화
          </Button>
        )}
      </div>

      {/* 태그 멀티 선택 버튼 */}
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              aria-pressed={currentTags.includes(tag)}
              className='rounded-full'
            >
              <Badge
                variant={currentTags.includes(tag) ? 'default' : 'outline'}
                className='cursor-pointer text-xs transition-colors'
              >
                {tag}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
