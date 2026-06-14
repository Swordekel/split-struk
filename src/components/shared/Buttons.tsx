import type { ReactNode } from 'react'

export function PrimaryBtn({
  onClick,
  children,
  disabled,
  full,
  className,
  type,
}: {
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  full?: boolean
  className?: string
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? 'w-full' : ''} h-11 px-5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-1.5 transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
        boxShadow: '0 4px 16px rgba(139,90,60,0.22)',
      }}
    >
      {children}
    </button>
  )
}

export function GhostBtn({
  onClick,
  children,
  full,
  className,
}: {
  onClick?: () => void
  children: ReactNode
  full?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`${full ? 'w-full' : ''} h-11 px-5 rounded-2xl font-semibold text-sm border text-muted-foreground hover:bg-muted/40 transition-colors ${className ?? ''}`}
      style={{ borderColor: 'var(--border-medium, var(--border))' }}
    >
      {children}
    </button>
  )
}
