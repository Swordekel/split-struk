import { useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  MessageCircle,
  Save,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSplitStore } from '../store/useSplitStore'
import {
  calculateBreakdown,
  formatRupiah,
  grandTotal,
  subtotalAll,
} from '../lib/calculator'
import {
  buildPlainText,
  buildShareAllText,
  buildWhatsAppLink,
} from '../lib/whatsapp'
import { saveSplit } from '../lib/db'
import type { Split } from '../types'
import { Stepper } from './shared/Stepper'
import { Card, BottomBar } from './shared/Card'
import { GhostBtn, PrimaryBtn } from './shared/Buttons'
import { Avatar } from './shared/Avatar'

export default function SummaryCard() {
  const navigate = useNavigate()
  const store = useSplitStore()
  const {
    items,
    title,
    taxPercent,
    servicePercent,
    discountAmount,
    setTitle,
    setTaxPercent,
    setServicePercent,
    setDiscountAmount,
    setStep,
    toSplit,
    reset,
  } = store

  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const split: Split = useMemo(() => toSplit(), [toSplit])
  const breakdowns = useMemo(() => calculateBreakdown(split), [split])
  const subtotal = subtotalAll(items)
  const taxAmt = (subtotal * taxPercent) / 100
  const serviceAmt = (subtotal * servicePercent) / 100
  const total = grandTotal(split)

  async function handleSave() {
    setSaving(true)
    try {
      const id = await saveSplit(toSplit())
      setSavedId(id)
      setTimeout(() => {
        reset()
        navigate('/')
      }, 1400)
    } finally {
      setSaving(false)
    }
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <Stepper step={5} />
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        <div className="px-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-bold text-xl bg-transparent border-none outline-none"
            style={{
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          />
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pajak %', val: taxPercent, set: setTaxPercent },
            { label: 'Service %', val: servicePercent, set: setServicePercent },
            {
              label: 'Diskon Rp',
              val: discountAmount,
              set: setDiscountAmount,
            },
          ].map(({ label, val, set }) => (
            <Card key={label} className="p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {label}
              </p>
              <input
                type="number"
                inputMode="numeric"
                value={val || ''}
                placeholder="0"
                onChange={(e) => set(parseFloat(e.target.value) || 0)}
                className="w-full text-center font-bold text-base bg-transparent border-none outline-none tnum"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                }}
              />
            </Card>
          ))}
        </div>

        <div
          className="rounded-3xl p-5"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
            boxShadow: '0 12px 32px rgba(139,90,60,0.28)',
          }}
        >
          <div className="space-y-2.5">
            {[
              { label: 'Subtotal', value: subtotal },
              { label: `Pajak (${taxPercent}%)`, value: taxAmt },
              { label: `Service (${servicePercent}%)`, value: serviceAmt },
              { label: 'Diskon', value: -discountAmount },
            ]
              .filter((row) => row.value !== 0 || row.label === 'Subtotal')
              .map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center"
                >
                  <span
                    className="text-xs opacity-75"
                    style={{ color: '#F5EBE0' }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs tnum opacity-75"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#F5EBE0',
                    }}
                  >
                    {value < 0 ? '−' : ''}
                    {formatRupiah(Math.abs(value))}
                  </span>
                </div>
              ))}
            <div
              className="h-px opacity-25 my-1"
              style={{ backgroundColor: '#F5EBE0' }}
            />
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm" style={{ color: '#F5EBE0' }}>
                TOTAL
              </span>
              <span
                className="font-extrabold text-2xl tnum"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#F5EBE0',
                  letterSpacing: '-0.03em',
                }}
              >
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>

        <h3
          className="font-bold text-base px-1"
          style={{ letterSpacing: '-0.01em' }}
        >
          Per Orang
        </h3>
        <div className="space-y-3">
          {breakdowns.map((b) => {
            const waLink = buildWhatsAppLink(b, split)
            const text = buildPlainText(b, split)
            const expandedKey = b.person.id
            return (
              <Card key={b.person.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={b.person.name}
                      color={b.person.color}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {b.person.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.items.length} item
                      </p>
                    </div>
                    <span
                      className="font-bold text-base tnum flex-shrink-0"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {formatRupiah(b.total)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setExpanded(expanded === expandedKey ? null : expandedKey)
                    }
                    className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Lihat rincian
                    <ChevronDown
                      size={12}
                      className="transition-transform duration-200"
                      style={{
                        transform:
                          expanded === expandedKey
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  {expanded === expandedKey && (
                    <div
                      className="mt-3 pt-3 space-y-1.5 border-t"
                      style={{ borderColor: 'rgba(43,24,16,0.08)' }}
                    >
                      {b.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {it.name}
                          </span>
                          <span
                            className="tnum font-medium"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {formatRupiah(it.share)}
                          </span>
                        </div>
                      ))}
                      {b.tax > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Pajak</span>
                          <span
                            className="tnum font-medium"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {formatRupiah(b.tax)}
                          </span>
                        </div>
                      )}
                      {b.service > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Service</span>
                          <span
                            className="tnum font-medium"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {formatRupiah(b.service)}
                          </span>
                        </div>
                      )}
                      {b.discount > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Diskon</span>
                          <span
                            className="tnum font-medium"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            −{formatRupiah(b.discount)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className="grid grid-cols-2 border-t"
                  style={{ borderColor: 'rgba(43,24,16,0.08)' }}
                >
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 flex items-center justify-center gap-1.5 text-xs font-semibold border-r hover:bg-muted/40 transition-colors"
                    style={{
                      borderColor: 'rgba(43,24,16,0.08)',
                      color: 'var(--accent-success)',
                    }}
                  >
                    <MessageCircle size={13} /> Kirim WA
                  </a>
                  <button
                    onClick={() => copyText(text, b.person.id + '-copy')}
                    className="h-11 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition-colors"
                  >
                    {copied === b.person.id + '-copy' ? (
                      <Check size={13} />
                    ) : (
                      <Copy size={13} />
                    )}{' '}
                    Copy
                  </button>
                </div>
              </Card>
            )
          })}
        </div>

        <button
          onClick={() =>
            copyText(buildShareAllText(breakdowns, split), 'all')
          }
          className="w-full h-11 rounded-2xl font-semibold text-sm border flex items-center justify-center gap-2 hover:bg-muted/40 transition-colors"
          style={{
            borderColor: 'var(--border-strong)',
            color: 'var(--accent-primary)',
          }}
        >
          {copied === 'all' ? <Check size={15} /> : <Copy size={15} />} Copy
          ringkasan semua orang
        </button>
      </div>

      <BottomBar>
        <GhostBtn onClick={() => setStep('tag')}>
          <span className="flex items-center gap-1.5">
            <ChevronLeft size={15} /> Edit
          </span>
        </GhostBtn>
        <PrimaryBtn onClick={handleSave} disabled={saving} full>
          {savedId !== null ? (
            <>
              <Check size={15} /> Tersimpan!
            </>
          ) : (
            <>
              <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
            </>
          )}
        </PrimaryBtn>
      </BottomBar>
    </div>
  )
}
