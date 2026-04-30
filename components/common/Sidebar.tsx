'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Award, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

const NAV_ITEMS = [
  { href: '/', label: 'AI Research', icon: Brain, exact: true },
  { href: '/expert', label: 'Expert Research', icon: Award, exact: false },
  { href: '/search', label: '검색', icon: Search, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='flex w-56 shrink-0 flex-col border-r border-border/60 bg-background sticky top-0 h-screen overflow-y-auto'>
      {/* 홈페이지 제목 */}
      <div className='px-4 py-5'>
        <Link href='/' className='flex items-center gap-2 group'>
          <span className='size-2 shrink-0 rounded-full bg-primary transition-transform group-hover:scale-125' />
          <span className='text-sm font-bold tracking-tight leading-snug'>
            Research Archive
          </span>
        </Link>
      </div>

      {/* 내비게이션 */}
      <nav className='flex-1 px-3 pb-4'>
        <ul className='space-y-0.5'>
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  )}
                >
                  <Icon className='size-4 shrink-0' />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단: 테마 토글 */}
      <div className='border-t border-border/60 px-3 py-3'>
        <ThemeToggle />
      </div>
    </aside>
  )
}
