import type { Currency } from '@/types/research'

/** KRW/USD 통화에 맞는 목표가 포맷 문자열 반환 */
export function formatPrice(value: number, currency: Currency): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Date를 'YYYY.MM.DD' 형식으로 변환 */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

/** Date를 'n일 전' / 'n개월 전' 상대시간 문자열로 변환 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return '오늘'
  if (diffDays < 30) return `${diffDays}일 전`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}개월 전`
  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears}년 전`
}
