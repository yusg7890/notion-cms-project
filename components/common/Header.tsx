import { Suspense } from 'react'
import Link from 'next/link'
import { HeaderSearch } from './HeaderSearch'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  return (
    <header className='sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md'>
      <div className='mx-auto flex h-14 max-w-3xl items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2 group'>
          <span className='size-2 rounded-full bg-primary transition-transform group-hover:scale-125' />
          <span className='text-sm font-semibold tracking-tight'>AI Stock Research Archive</span>
        </Link>
        <nav className='flex items-center gap-2 text-sm text-muted-foreground'>
          <ThemeToggle />
          <Suspense fallback={<div className='h-7 w-36 rounded-md bg-muted animate-pulse' />}>
            <HeaderSearch />
          </Suspense>
        </nav>
      </div>
    </header>
  )
}
