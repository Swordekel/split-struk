import type { ReactNode } from 'react'

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border ${className ?? ''} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-soft)',
        boxShadow: '0 4px 12px rgba(43,24,16,0.08)',
      }}
    >
      {children}
    </div>
  )
}

export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky bottom-0 border-t px-4 py-4 flex gap-3"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      {children}
    </div>
  )
}
