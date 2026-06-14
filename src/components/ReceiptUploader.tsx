import { useRef, useState } from 'react'
import { Camera, Lock, Lightbulb } from 'lucide-react'
import { runOCR } from '../lib/ocr'
import { detectTotals, parseReceipt } from '../lib/parser'
import { useSplitStore } from '../store/useSplitStore'
import { Stepper } from './shared/Stepper'
import { ProgressBar } from './shared/ProgressBar'
import { BottomBar } from './shared/Card'
import { GhostBtn } from './shared/Buttons'
import { useNavigate } from 'react-router-dom'

export default function ReceiptUploader() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const {
    setItems,
    setReceiptImage,
    setRawOcrText,
    setStep,
    setTaxPercent,
    setServicePercent,
  } = useSplitStore()

  async function handleFile(file: File) {
    setError(null)
    setProgress(0)
    try {
      setReceiptImage(file)
      const { text } = await runOCR(file, (p) => setProgress(p))
      setRawOcrText(text)
      const items = parseReceipt(text)
      const totals = detectTotals(text)
      if (totals.taxPercent) setTaxPercent(totals.taxPercent)
      if (totals.servicePercent) setServicePercent(totals.servicePercent)
      setItems(items)
      setStep('items')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OCR gagal')
    } finally {
      setProgress(null)
    }
  }

  function skipUpload() {
    setItems([])
    setStep('items')
  }

  const percent = progress !== null ? Math.round(progress * 100) : 0

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <Stepper step={1} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-8">
        <div
          className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(139,90,60,0.1) 0%, rgba(107,68,35,0.06) 100%)',
            border: '2px dashed rgba(139,90,60,0.35)',
          }}
        >
          <Camera
            size={48}
            style={{ color: 'var(--accent-primary)' }}
            strokeWidth={1.5}
          />
        </div>

        <h2
          className="font-bold text-xl mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          Upload Foto Struk
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
          Foto diproses langsung di HP kamu.
          <br />
          Tidak ada yang dikirim ke server.
        </p>

        {progress !== null ? (
          <div className="w-full max-w-xs space-y-3">
            <ProgressBar percent={percent} />
            <p
              className="text-sm font-semibold text-muted-foreground tnum"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Memproses... {percent}%
            </p>
            <div className="flex justify-center gap-1 pt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    animation: `bounce-dot 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full max-w-xs h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
                boxShadow: '0 8px 24px rgba(139,90,60,0.25)',
              }}
            >
              <Camera size={20} /> Pilih Foto Struk
            </button>
            <button
              onClick={skipUpload}
              className="mt-4 text-sm font-medium underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Atau input manual saja →
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive">{error}</div>
        )}

        <div className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={11} />
          <span>End-to-end private</span>
        </div>

        {progress === null && (
          <div
            className="mt-6 w-full max-w-sm rounded-2xl p-4 text-left"
            style={{
              backgroundColor: 'rgba(139,90,60,0.06)',
              border: '1px solid rgba(139,90,60,0.18)',
            }}
          >
            <div
              className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--accent-primary)' }}
            >
              <Lightbulb size={12} /> Tips foto struk
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <li>• Letakkan struk di permukaan datar & rata</li>
              <li>• Foto lurus dari atas, jangan miring</li>
              <li>• Cahaya cukup terang, hindari bayangan</li>
              <li>• Crop hanya bagian struk (tanpa background)</li>
              <li>• Struk thermal yang pudar memang sulit — edit manual OK</li>
            </ul>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      <BottomBar>
        <GhostBtn full onClick={() => navigate('/')}>
          Kembali
        </GhostBtn>
      </BottomBar>
    </div>
  )
}
