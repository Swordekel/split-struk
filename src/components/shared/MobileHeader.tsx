import { ChevronLeft, Moon, Receipt, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../store/useThemeStore'

export function MobileHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDark = useThemeStore((s) => s.isDark)
  const toggleTheme = useThemeStore((s) => s.toggle)

  const showBack = location.pathname !== '/'

  return (
    <header
      className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b"
      style={{
        backgroundColor: isDark
          ? 'rgba(26,20,16,0.94)'
          : 'rgba(245,235,224,0.94)',
        backdropFilter: 'blur(14px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/40 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <Receipt
            size={16}
            strokeWidth={2}
            style={{ color: 'var(--accent-primary)' }}
          />
          <span
            className="font-extrabold text-sm"
            style={{ letterSpacing: '-0.03em' }}
          >
            SplitStruk
          </span>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          backgroundColor: isDark
            ? 'rgba(212,163,115,0.1)'
            : 'rgba(43,24,16,0.06)',
        }}
      >
        {isDark ? (
          <Sun size={17} style={{ color: 'var(--accent-primary)' }} />
        ) : (
          <Moon size={17} style={{ color: 'var(--accent-primary)' }} />
        )}
      </button>
    </header>
  )
}
