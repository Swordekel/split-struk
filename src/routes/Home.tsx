import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { deleteSplit, getAllSplits } from '../lib/db'
import { formatRupiah, grandTotal } from '../lib/calculator'
import type { Split } from '../types'
import { useSplitStore } from '../store/useSplitStore'
import {
  EmptyCupIllustration,
  ReceiptHeroIllustration,
} from '../components/shared/Illustrations'
import { AvatarGroup } from '../components/shared/Avatar'

export default function Home() {
  const navigate = useNavigate()
  const reset = useSplitStore((s) => s.reset)
  const [history, setHistory] = useState<Split[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    setHistory(await getAllSplits())
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    if (!confirm('Hapus tagihan ini?')) return
    await deleteSplit(id)
    refresh()
  }

  function handleNew() {
    reset()
    navigate('/new')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="w-44 h-44 mb-6">
          <ReceiptHeroIllustration />
        </div>
        <h1
          className="font-extrabold tracking-tight leading-tight mb-3"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
            letterSpacing: '-0.03em',
          }}
        >
          Foto struk,
          <br />
          tag teman,
          <br />
          kirim ke WhatsApp.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          100% di HP kamu. Tanpa server. Tanpa login.
        </p>
      </div>

      <div className="px-4 pb-8">
        <button
          onClick={handleNew}
          className="w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
            boxShadow: '0 8px 24px rgba(139,90,60,0.3)',
            letterSpacing: '-0.01em',
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
          Bagi Tagihan Baru
        </button>
      </div>

      {/* History — mobile only (desktop shows in sidebar) */}
      <div className="px-4 flex-1 lg:hidden">
        <h2
          className="text-base font-bold mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Riwayat
        </h2>
        {loading ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            Memuat...
          </p>
        ) : history.length > 0 ? (
          <div className="flex flex-col gap-3">
            {history.map((record) => (
              <button
                key={record.id}
                onClick={() => navigate(`/split/${record.id}`)}
                className="w-full text-left rounded-2xl p-4 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-soft)',
                  boxShadow: '0 4px 12px rgba(43,24,16,0.08)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {record.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(record.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <AvatarGroup people={record.people} />
                      <span className="text-xs text-muted-foreground">
                        {record.people.length} orang
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                    <span
                      className="font-bold text-sm tnum"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {formatRupiah(grandTotal(record))}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, record.id!)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <EmptyCupIllustration />
            <p className="font-semibold text-sm mt-4">Belum ada tagihan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mulai dengan tombol di atas
            </p>
          </div>
        )}
      </div>

      {/* Desktop: prompt to pick from sidebar */}
      <div className="hidden lg:flex flex-col items-center py-12 text-center px-4 flex-1">
        <EmptyCupIllustration />
        <p
          className="font-semibold text-sm mt-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {history.length > 0
            ? 'Pilih riwayat di sidebar'
            : 'Belum ada riwayat'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          atau mulai tagihan baru di atas
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground py-8 mt-4">
        Open source · No tracking · 100% client-side
      </p>
    </div>
  )
}
