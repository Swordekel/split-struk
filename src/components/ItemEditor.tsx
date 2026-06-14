import { useState } from 'react'
import { ChevronRight, FileText, Plus, Trash2 } from 'lucide-react'
import { useSplitStore } from '../store/useSplitStore'
import { formatRupiah, subtotalAll } from '../lib/calculator'
import { Stepper } from './shared/Stepper'
import { Card, BottomBar } from './shared/Card'
import { GhostBtn, PrimaryBtn } from './shared/Buttons'

export default function ItemEditor() {
  const { items, addItem, updateItem, removeItem, setStep, rawOcrText } =
    useSplitStore()
  const [showRaw, setShowRaw] = useState(false)

  const subtotal = subtotalAll(items)
  const canContinue =
    items.length > 0 &&
    items.every((it) => it.name.trim() && it.unitPrice > 0)

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <Stepper step={2} />
      </div>

      <div className="px-4 pb-3">
        <h2
          className="font-bold text-xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Edit Item
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cek dan edit item dari struk kamu
        </p>
        {rawOcrText && (
          <button
            onClick={() => setShowRaw((s) => !s)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: 'var(--accent-primary)' }}
          >
            <FileText size={12} />
            {showRaw ? 'Sembunyikan' : 'Lihat'} teks OCR mentah
          </button>
        )}
      </div>

      {showRaw && rawOcrText && (
        <div className="mx-4 mb-3">
          <Card>
            <pre
              className="p-3 text-[10px] leading-relaxed whitespace-pre-wrap overflow-auto max-h-60"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              {rawOcrText}
            </pre>
          </Card>
          <p className="text-[10px] text-muted-foreground mt-1.5 px-1 leading-relaxed">
            Kalau ada item yang tidak ke-detect, biasanya karena baris itu memang
            tidak terbaca Tesseract OCR. Tambahkan manual dengan tombol di
            bawah.
          </p>
        </div>
      )}

      <div className="flex-1 px-4 py-2 space-y-3 overflow-auto">
        {items.length === 0 && (
          <div
            className="text-center py-8 rounded-2xl border-2 border-dashed text-sm text-muted-foreground"
            style={{ borderColor: 'var(--border-medium)' }}
          >
            Belum ada item. Tambah dulu di bawah.
          </div>
        )}

        {items.map((it) => (
          <Card key={it.id}>
            <div className="p-4">
              <input
                value={it.name}
                placeholder="Nama item"
                onChange={(e) => updateItem(it.id, { name: e.target.value })}
                className="w-full font-semibold text-sm bg-transparent border-none outline-none mb-3"
                style={{ color: 'var(--text-primary)' }}
              />
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center rounded-xl"
                  style={{ border: '1.5px solid rgba(139,90,60,0.3)' }}
                >
                  <button
                    onClick={() =>
                      updateItem(it.id, { qty: Math.max(1, it.qty - 1) })
                    }
                    className="w-8 h-8 flex items-center justify-center text-lg leading-none font-medium flex-shrink-0"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={it.qty || ''}
                    onChange={(e) =>
                      updateItem(it.id, {
                        qty: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-14 text-center text-sm font-bold tnum bg-transparent border-none outline-none"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    onClick={() => updateItem(it.id, { qty: it.qty + 1 })}
                    className="w-8 h-8 flex items-center justify-center text-lg leading-none font-medium flex-shrink-0"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    +
                  </button>
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  ×
                </span>
                <div
                  className="flex-1 flex items-center gap-1 rounded-xl h-9 px-2"
                  style={{ border: '1.5px solid rgba(139,90,60,0.2)' }}
                >
                  <span
                    className="text-xs font-medium text-muted-foreground"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Rp
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={it.unitPrice || ''}
                    placeholder="0"
                    onChange={(e) =>
                      updateItem(it.id, {
                        unitPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-medium tnum"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="flex justify-end mt-2.5">
                <span
                  className="text-xs font-bold tnum"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  = {formatRupiah(it.qty * it.unitPrice)}
                </span>
              </div>
            </div>
          </Card>
        ))}

        <button
          onClick={addItem}
          className="w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
          style={{
            border: '2px dashed rgba(139,90,60,0.4)',
            color: 'var(--accent-primary)',
          }}
        >
          <Plus size={16} /> Tambah Item
        </button>
      </div>

      <BottomBar>
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground font-medium">
              Subtotal
            </span>
            <span
              className="font-bold tnum"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-primary)',
              }}
            >
              {formatRupiah(subtotal)}
            </span>
          </div>
          <div className="flex gap-3">
            <GhostBtn onClick={() => setStep('upload')}>Kembali</GhostBtn>
            <PrimaryBtn
              onClick={() => setStep('people')}
              disabled={!canContinue}
              full
            >
              Lanjut <ChevronRight size={16} />
            </PrimaryBtn>
          </div>
        </div>
      </BottomBar>
    </div>
  )
}
