import Link from 'next/link'

export default function Header() {
  return (
    <header className='sticky top-0 z-10 border-b border-border bg-background'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
        <Link href='/' className='text-sm font-semibold tracking-tight'>
          AI Stock Research Archive
        </Link>
        <nav className='flex items-center gap-4 text-sm text-muted-foreground'>
          <Link href='/' className='hover:text-foreground transition-colors'>
            홈
          </Link>
          <Link href='/search' className='hover:text-foreground transition-colors'>
            검색
          </Link>
        </nav>
      </div>
    </header>
  )
}
