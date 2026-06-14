export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${clamped}%`,
          background:
            'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        }}
      />
    </div>
  )
}
