import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { History, Moon, Plus, Receipt, Sun } from 'lucide-react'
import { getAllSplits } from '../../lib/db'
import { formatRupiah, grandTotal } from '../../lib/calculator'
import { useThemeStore } from '../../store/useThemeStore'
import { useSplitStore } from '../../store/useSplitStore'
import type { Split, WizardStep } from '../../types'
import { AvatarGroup } from './Avatar'

const WIZARD_STEPS: WizardStep[] = ['upload', 'items', 'people', 'tag', 'summary']

export function DesktopSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDark = useThemeStore((s) => s.isDark)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const wizardStep = useSplitStore((s) => s.step)
  const resetSplit = useSplitStore((s) => s.reset)
  const [history, setHistory] = useState<Split[]>([])

  const isWizard = location.pathname === '/new'
  const accentText = 'var(--accent-primary)'

  useEffect(() => {
    let cancelled = false
    async function load() {
      const all = await getAllSplits()
      if (!cancelled) setHistory(all)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [location.pathname])

  function handleNew() {
    resetSplit()
    navigate('/new')
  }

  const stepIndex = WIZARD_STEPS.indexOf(wizardStep) + 1

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 border-r overflow-hidden"
      style={{
        width: 288,
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Logo + theme toggle */}
      <div className="flex items-center justify-between px-6 pt-8 pb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
            }}
          >
            <Receipt size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            className="font-extrabold text-base"
            style={{ letterSpacing: '-0.03em' }}
          >
            SplitStruk
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: isDark
              ? 'rgba(212,163,115,0.1)'
              : 'rgba(43,24,16,0.06)',
          }}
        >
          {isDark ? (
            <Sun size={15} style={{ color: 'var(--accent-primary)' }} />
          ) : (
            <Moon size={15} style={{ color: 'var(--accent-primary)' }} />
          )}
        </button>
      </div>

      {/* New split CTA */}
      <div className="px-4 pb-6">
        <button
          onClick={handleNew}
          className="w-full h-11 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
            boxShadow: '0 4px 16px rgba(139,90,60,0.25)',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Bagi Tagihan Baru
        </button>
      </div>

      {/* Nav header */}
      <div className="px-4 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            backgroundColor: isDark
              ? 'rgba(245,235,224,0.05)'
              : 'rgba(43,24,16,0.05)',
          }}
        >
          <History size={14} style={{ color: accentText }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: accentText }}
          >
            Riwayat
          </span>
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-auto px-4 space-y-2 pb-4">
        {history.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">
            Belum ada riwayat
          </p>
        )}
        {history.map((record) => (
          <button
            key={record.id}
            onClick={() => navigate(`/split/${record.id}`)}
            className="w-full text-left rounded-xl p-3 transition-all duration-150 hover:scale-[1.01]"
            style={{
              backgroundColor: isDark
                ? 'rgba(42,31,23,0.9)'
                : 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(43,24,16,0.09)',
              boxShadow: '0 2px 8px rgba(43,24,16,0.06)',
            }}
          >
            <p
              className="font-semibold text-xs truncate mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {record.title}
            </p>
            <div className="flex items-center justify-between">
              <AvatarGroup people={record.people} />
              <span
                className="text-xs font-bold tnum"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: accentText,
                }}
              >
                {formatRupiah(grandTotal(record))}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {new Date(record.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </button>
        ))}
      </div>

      {/* Wizard progress indicator */}
      {isWizard && (
        <div
          className="mx-4 mb-4 p-3 rounded-xl"
          style={{
            backgroundColor: isDark
              ? 'rgba(139,90,60,0.12)'
              : 'rgba(139,90,60,0.08)',
            border: '1px solid rgba(139,90,60,0.2)',
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-2"
            style={{ color: accentText }}
          >
            Sedang dalam proses
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    s <= stepIndex
                      ? 'var(--accent-primary)'
                      : 'rgba(139,90,60,0.2)',
                }}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {stepIndex}/5 langkah
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        className="px-6 py-5 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Open source · No tracking
          <br />
          100% client-side
        </p>
      </div>
    </aside>
  )
}
