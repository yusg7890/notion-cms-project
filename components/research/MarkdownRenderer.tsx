'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
}

/** Notion 본문 마크다운을 렌더링하는 컴포넌트 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return (
      <p className='text-sm text-muted-foreground italic py-8 text-center'>
        본문 내용이 없습니다.
      </p>
    )
  }

  return (
    <article className='prose max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='text-xl font-bold mt-8 mb-4 pb-1 border-b'>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-lg font-semibold mt-8 mb-3 pb-1 border-b'>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-base font-semibold mt-6 mb-2'>{children}</h3>
          ),
          p: ({ children }) => (
            <p className='text-sm leading-7 mb-4 text-foreground/80'>{children}</p>
          ),
          ul: ({ children }) => (
            <ul className='list-disc list-inside mb-4 space-y-1 text-sm text-foreground/80'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal list-inside mb-4 space-y-1 text-sm text-foreground/80'>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className='leading-6'>{children}</li>,
          code: ({ children }) => (
            <code className='bg-muted px-1.5 py-0.5 rounded text-xs font-mono'>{children}</code>
          ),
          pre: ({ children }) => (
            <pre className='bg-muted rounded-md p-4 overflow-x-auto mb-4 text-xs font-mono'>
              {children}
            </pre>
          ),
          strong: ({ children }) => (
            <strong className='font-semibold text-foreground'>{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary underline underline-offset-2 hover:opacity-80'
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <FallbackImage src={typeof src === 'string' ? src : undefined} alt={alt} />
          ),
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground text-sm my-4'>
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className='overflow-x-auto mb-4'>
              <table className='w-full text-sm border-collapse'>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className='border border-border bg-muted px-3 py-2 text-left font-semibold text-xs'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='border border-border px-3 py-2 text-xs'>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

/** 이미지 로드 실패 시 fallback UI를 표시하는 컴포넌트 */
function FallbackImage({ src, alt }: { src?: string; alt?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <span className='flex items-center justify-center bg-muted rounded-md h-32 text-xs text-muted-foreground my-4'>
        이미지를 불러올 수 없습니다
      </span>
    )
  }

  return (
    <span className='block relative w-full my-4' style={{ minHeight: '200px' }}>
      <Image
        src={src}
        alt={alt ?? ''}
        fill
        className='object-contain rounded-md'
        onError={() => setFailed(true)}
        unoptimized
      />
    </span>
  )
}
