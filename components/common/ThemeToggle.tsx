'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 마운트 전에는 렌더 안 함 — hydration mismatch 방지
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant='ghost' size='icon' className='size-7' disabled />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-7'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? <Sun className='size-4' /> : <Moon className='size-4' />}
    </Button>
  )
}
