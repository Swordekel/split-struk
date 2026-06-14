import { useThemeStore } from '../../store/useThemeStore'

export function ReceiptHeroIllustration() {
  const isDark = useThemeStore((s) => s.isDark)
  const brown = isDark ? '#D4A373' : '#8B5A3C'
  const paper = isDark ? '#2A1F17' : '#FFFFFF'
  const line = isDark ? '#A89580' : '#8B6F5A'
  const accent = isDark ? '#E8C9A0' : '#8B5A3C'
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <ellipse cx="26" cy="44" rx="13" ry="8" fill={brown} opacity="0.25" transform="rotate(-20 26 44)" />
      <line x1="26" y1="37.5" x2="26" y2="51" stroke={brown} strokeWidth="1.2" opacity="0.3" transform="rotate(-20 26 44)" />
      <ellipse cx="135" cy="32" rx="11" ry="7" fill={brown} opacity="0.2" transform="rotate(15 135 32)" />
      <line x1="135" y1="26" x2="135" y2="39" stroke={brown} strokeWidth="1.2" opacity="0.25" transform="rotate(15 135 32)" />
      <ellipse cx="142" cy="122" rx="9" ry="6" fill={brown} opacity="0.18" transform="rotate(-8 142 122)" />
      <line x1="142" y1="117" x2="142" y2="128" stroke={brown} strokeWidth="1" opacity="0.2" transform="rotate(-8 142 122)" />
      <rect x="50" y="26" width="68" height="108" rx="8" fill="rgba(43,24,16,0.08)" transform="translate(4,6)" />
      <rect x="50" y="22" width="68" height="110" rx="8" fill={paper} />
      <rect x="50" y="22" width="68" height="20" rx="8" fill={brown} opacity="0.8" />
      <rect x="50" y="30" width="68" height="12" fill={brown} opacity="0.8" />
      <rect x="68" y="28" width="32" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="60" y={56 + i * 15} width={22 + (i % 3) * 6} height="3" rx="1.5" fill={line} opacity="0.35" />
          <rect x="97" y={56 + i * 15} width="14" height="3" rx="1.5" fill={accent} opacity="0.55" />
        </g>
      ))}
      <rect x="57" y="135" width="54" height="1" fill={line} opacity="0.25" />
      <rect x="60" y="141" width="18" height="4" rx="2" fill={line} opacity="0.4" />
      <rect x="93" y="141" width="18" height="4" rx="2" fill={brown} opacity="0.85" />
      <path
        d="M50 150 L55 157 L60 150 L65 157 L70 150 L75 157 L80 150 L85 157 L90 150 L95 157 L100 150 L105 157 L110 150 L115 157 L118 150"
        stroke={paper}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EmptyCupIllustration() {
  const isDark = useThemeStore((s) => s.isDark)
  const brown = isDark ? '#D4A373' : '#8B5A3C'
  const steam = isDark ? '#A89580' : '#8B6F5A'
  return (
    <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-24">
      <ellipse cx="60" cy="98" rx="28" ry="5" fill={brown} opacity="0.12" />
      <ellipse cx="60" cy="94" rx="24" ry="5" fill={brown} opacity="0.35" />
      <path d="M38 58 Q36 92 60 92 Q84 92 82 58 Z" fill={isDark ? '#2A1F17' : '#FAF3E7'} stroke={brown} strokeWidth="2" />
      <ellipse cx="60" cy="58" rx="22" ry="5" fill={isDark ? '#3A2F27' : '#F5EBE0'} stroke={brown} strokeWidth="2" />
      <path d="M82 66 Q98 66 98 76 Q98 86 82 84" stroke={brown} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 48 Q52 40 50 32" stroke={steam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M60 46 Q62 38 60 29" stroke={steam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M70 48 Q72 40 70 32" stroke={steam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  )
}

export function CoffeeBeanBg() {
  const isDark = useThemeStore((s) => s.isDark)
  const c = isDark ? '#D4A373' : '#8B5A3C'
  const beans = [
    { x: 80, y: 120, rx: 18, ry: 11, rot: -30, op: 0.07 },
    { x: 1320, y: 200, rx: 22, ry: 14, rot: 20, op: 0.06 },
    { x: 200, y: 700, rx: 16, ry: 10, rot: 45, op: 0.055 },
    { x: 1380, y: 650, rx: 20, ry: 12, rot: -15, op: 0.065 },
    { x: 650, y: 60, rx: 15, ry: 9, rot: 10, op: 0.05 },
    { x: 750, y: 830, rx: 17, ry: 10, rot: -40, op: 0.05 },
    { x: 120, y: 420, rx: 14, ry: 8, rot: 55, op: 0.045 },
    { x: 1260, y: 420, rx: 19, ry: 11, rot: -20, op: 0.055 },
    { x: 400, y: 160, rx: 13, ry: 8, rot: 30, op: 0.04 },
    { x: 1050, y: 140, rx: 16, ry: 10, rot: -35, op: 0.045 },
    { x: 300, y: 860, rx: 15, ry: 9, rot: 25, op: 0.04 },
    { x: 1100, y: 800, rx: 18, ry: 11, rot: 15, op: 0.05 },
  ]
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
    >
      {beans.map((b, i) => (
        <g
          key={i}
          transform={`translate(${b.x},${b.y}) rotate(${b.rot})`}
          opacity={b.op}
        >
          <ellipse rx={b.rx} ry={b.ry} fill={c} />
          <line
            x1={0}
            y1={-b.ry * 0.85}
            x2={0}
            y2={b.ry * 0.85}
            stroke={c}
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  )
}
