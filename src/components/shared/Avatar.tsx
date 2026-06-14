import type { Person } from '../../types'

const SIZE = {
  sm: { box: 'w-8 h-8', text: 'text-[10px]' },
  md: { box: 'w-10 h-10', text: 'text-xs' },
  lg: { box: 'w-12 h-12', text: 'text-sm' },
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0] ?? '').join('').toUpperCase() || '?'
}

export function Avatar({
  name,
  color,
  size = 'md',
}: {
  name: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const cls = SIZE[size]
  return (
    <div
      className={`${cls.box} ${cls.text} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  )
}

export function AvatarGroup({ people }: { people: Person[] }) {
  return (
    <div className="flex -space-x-2">
      {people.slice(0, 4).map((p, i) => (
        <div key={p.id} style={{ zIndex: 4 - i, position: 'relative' }}>
          <Avatar name={p.name} color={p.color} size="sm" />
        </div>
      ))}
      {people.length > 4 && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground"
          style={{
            backgroundColor: 'var(--muted)',
            border: '1px solid var(--border)',
            position: 'relative',
          }}
        >
          +{people.length - 4}
        </div>
      )}
    </div>
  )
}
