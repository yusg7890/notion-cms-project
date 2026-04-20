import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'AI Stock Research Archive',
  description: 'Claude가 생성한 종목 분석 리서치를 시계열로 추적하는 개인 투자 학습 기록 아카이브',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko' className={cn('h-full antialiased', inter.variable)}>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}
