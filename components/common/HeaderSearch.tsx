'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

/** 헤더 검색 인풋 — Enter 키 입력 시 /search?q=값 으로 이동 */
export function HeaderSearch() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <div className='relative flex items-center'>
      <Search className='absolute left-2 size-3.5 text-muted-foreground pointer-events-none' />
      <Input
        type='search'
        placeholder='종목명 검색...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className='h-7 w-36 pl-7 text-xs focus:w-48 transition-all duration-200'
      />
    </div>
  )
}
