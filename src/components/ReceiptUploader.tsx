import { useRef, useState } from 'react'
import { Camera, Lock, Lightbulb, Image } from 'lucide-react'
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
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [showSourceSelector, setShowSourceSelector] = useState(false)
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
              onClick={() => setShowSourceSelector(true)}
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
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ''
          }}
        />

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ''
          }}
        />
      </div>

      {/* Modern Bottom Sheet for Source Selection */}
      {showSourceSelector && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop with blur & fade animation */}
          <div 
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setShowSourceSelector(false)}
          />
          
          {/* Sheet with slide-up animation */}
          <div 
            className="relative bg-[var(--bg-elevated)] rounded-t-3xl p-6 pb-8 space-y-5 shadow-2xl border-t border-[var(--border-soft)] animate-sheet-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle indicator */}
            <div className="flex justify-center -mt-3 mb-2">
              <div className="w-12 h-1.5 rounded-full bg-[var(--text-muted)] opacity-30" />
            </div>
            
            {/* Header text */}
            <div className="text-center">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Pilih Foto Struk
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Gunakan kamera langsung atau pilih berkas dari galeri HP Anda
              </p>
            </div>
            
            {/* Selection Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Camera Button */}
              <button
                onClick={() => {
                  setShowSourceSelector(false)
                  cameraInputRef.current?.click()
                }}
                className="flex items-center gap-4 p-4 rounded-2xl text-left bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] active:scale-[0.98] transition-all duration-150"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(139,90,60,0.12)',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <Camera size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)]">Kamera (Ambil Foto)</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Potret struk belanja secara langsung</p>
                </div>
              </button>

              {/* Gallery Button */}
              <button
                onClick={() => {
                  setShowSourceSelector(false)
                  galleryInputRef.current?.click()
                }}
                className="flex items-center gap-4 p-4 rounded-2xl text-left bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] active:scale-[0.98] transition-all duration-150"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(139,90,60,0.12)',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <Image size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)]">Galeri (Pilih Foto)</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Pilih foto struk dari penyimpanan HP</p>
                </div>
              </button>
            </div>

            {/* Cancel Row */}
            <button
              onClick={() => setShowSourceSelector(false)}
              className="w-full h-12 rounded-2xl font-bold text-sm text-[var(--text-muted)] border border-[var(--border-medium)] hover:bg-[var(--bg-muted)] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <BottomBar>
        <GhostBtn full onClick={() => navigate('/')}>
          Kembali
        </GhostBtn>
      </BottomBar>
    </div>
  )
}
