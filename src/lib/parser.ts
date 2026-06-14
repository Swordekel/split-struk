import { v4 as uuid } from 'uuid'
import type { Item } from '../types'

const SKIP_KEYWORDS = [
  // total/pajak/bayar
  'subtotal',
  'sub total',
  'sub-total',
  'total',
  'grand total',
  'pajak',
  'tax',
  'ppn',
  'pb1',
  'service',
  'sc ',
  'svc',
  'kembalian',
  'kembali',
  'tunai',
  'cash',
  'bayar',
  'change',
  'discount',
  'diskon',
  'rounding',
  'pembulatan',
  // metadata struk
  'no.',
  'no ',
  'meja',
  'table',
  'kasir',
  'cashier',
  'tanggal',
  'date',
  'struk',
  'terima kasih',
  'terimakasih',
  'thank you',
  // pembayaran
  'qris',
  'gopay',
  'ovo',
  'dana ',
  'shopeepay',
  'linkaja',
  'bca',
  'bri',
  'bni',
  'mandiri',
  'visa',
  'master',
  // minimarket
  'indomaret',
  'alfamart',
  'alfa midi',
  'alfamidi',
  'circle k',
  'lawson',
  'family mart',
  // info struk lain
  'plu ',
  'npwp',
  'id pajak',
  'pelanggan',
  'alamat',
  'cabang',
  'jl.',
  'jln',
  'jalan ',
  'telp',
  'whatsapp',
  'wa ',
  'website',
  'www.',
  // perhitungan
  'harga jual',
  'harga normal',
  'anda hemat',
  ' hemat',
  'dpp ',
  'gp ',
  'bp ',
  'non pkp',
  'pkp ',
  'omzet',
  // closing
  'layanan',
  'konsumen',
  'call center',
  'selamat',
  'silakan',
  'silahkan',
  'kunjungi',
  'kunjungan',
  'feedback',
  'kritik',
  ' saran',
  // EDC
  'edc',
  'approval',
  'merchant',
  'trace',
  // shop labels
  'grosir',
  'sembako',
]

function shouldSkip(line: string): boolean {
  const lower = line.toLowerCase().trim()
  if (lower.length < 2) return true
  return SKIP_KEYWORDS.some((kw) => lower.includes(kw))
}

/**
 * Junk lines yang bukan item & bukan candidate name:
 * - URL/email
 * - tanggal/waktu
 * - kode panjang (struk #, barcode)
 */
function isJunkLine(line: string): boolean {
  if (line.includes('/')) return true
  if (line.includes('@')) return true
  if (/\.(com|id|co|net|org)\b/i.test(line)) return true
  if (/^www\.|^http/i.test(line)) return true
  // YYYY-MM-DD
  if (/\d{4}[\-/.]\d{2}[\-/.]\d{2}/.test(line)) return true
  // DD.MM.YYYY or DD-MM-YYYY
  if (/\d{2}[.\-]\d{2}[.\-]\d{4}/.test(line)) return true
  // HH:MM(:SS)
  if (/\d{2}:\d{2}(:\d{2})?/.test(line)) return true
  // long alphanumeric IDs separated by dash
  if (/-[\dA-Z]{4,}-/.test(line)) return true
  // 10+ digit run without separator (barcode/phone)
  if (/\d{10,}/.test(line.replace(/[.,\s]/g, ''))) return true
  return false
}

function hasAlpha(s: string): boolean {
  return /[a-zA-Z]{2,}/.test(s)
}

function parsePrice(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,]/g, '')
  if (!cleaned) return null

  let normalized = cleaned
  const lastDot = cleaned.lastIndexOf('.')
  const lastComma = cleaned.lastIndexOf(',')

  if (lastDot >= 0 && lastComma >= 0) {
    if (lastDot > lastComma) {
      normalized = cleaned.replace(/,/g, '')
    } else {
      normalized = cleaned.replace(/\./g, '').replace(',', '.')
    }
  } else if (lastDot >= 0) {
    const afterDot = cleaned.length - lastDot - 1
    if (afterDot === 3) normalized = cleaned.replace(/\./g, '')
  } else if (lastComma >= 0) {
    const afterComma = cleaned.length - lastComma - 1
    if (afterComma === 3) normalized = cleaned.replace(/,/g, '')
    else normalized = cleaned.replace(',', '.')
  }

  const val = parseFloat(normalized)
  if (!isFinite(val) || val < 0) return null
  return val
}

interface NumToken {
  value: number
  raw: string
  index: number
}

function findNumberTokens(line: string): NumToken[] {
  // Prefer multi-group numbers (1.234, 1.234.567) over plain digits
  const regex = /(?:\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)/g
  const tokens: NumToken[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(line)) !== null) {
    const v = parsePrice(m[0])
    if (v !== null) tokens.push({ value: v, raw: m[0], index: m.index })
  }
  return tokens
}

interface ParsedLine {
  name: string
  qty: number
  unitPrice: number
}

function isUrlLike(name: string): boolean {
  return /[\/@]|\.(com|id|co|net)|www\./i.test(name)
}

function isCurrencyPrefixOnly(name: string): boolean {
  const lower = name.toLowerCase().replace(/[.,\s]/g, '')
  return lower === 'rp' || lower === 'idr' || lower === 'rupiah'
}

function cleanName(name: string): string {
  return name
    .replace(/^\s*\d+\.\s+/, '') // leading "1. " item number
    .replace(/[:;|\-_=*]+$/, '') // trailing punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parse one line yang punya numeric token. Pakai pendingName kalau line gak
 * punya nama di awal.
 */
function parseTokenLine(
  line: string,
  tokens: NumToken[],
  pendingName: string | null,
): ParsedLine | null {
  const last = tokens[tokens.length - 1]
  const subtotal = last.value
  // Range realistis untuk harga IDR
  if (subtotal < 100 || subtotal > 10_000_000_000) return null

  // Cari nama: text sebelum token numerik pertama
  const beforeFirst = line.slice(0, tokens[0].index).trim()
  const cleanBefore = cleanName(beforeFirst)

  let name: string
  if (
    cleanBefore.length >= 2 &&
    hasAlpha(cleanBefore) &&
    !shouldSkip(cleanBefore) &&
    !isCurrencyPrefixOnly(cleanBefore)
  ) {
    name = cleanBefore
  } else if (pendingName) {
    name = pendingName
  } else {
    return null
  }

  // Tentukan qty & unitPrice
  let qty = 1
  let unitPrice = subtotal

  const unitWordRegex =
    /\b(pcs|pc|kg|kgs|klg|kgr|box|lusin|btg|set|ml|liter|ltr|lt|gr|gram|sak|kotak|bks|pack|bag|porsi|psg|pasang|ekor|biji)\b/i

  // Rule 1: token pertama kecil (<100) = qty
  if (
    tokens.length >= 2 &&
    tokens[0] !== last &&
    tokens[0].value > 0 &&
    tokens[0].value < 100
  ) {
    qty = Math.max(1, Math.round(tokens[0].value))
    unitPrice = Math.round(subtotal / qty)
  }
  // Rule 2: 3+ tokens, "QTY x UNITPRICE ... SUBTOTAL"
  else if (tokens.length >= 3) {
    const t0 = tokens[0]
    const t1 = tokens[1]
    if (t0 !== last && t1 !== last && t0.value >= 1 && t1.value >= 100) {
      const between = line.slice(t0.index + t0.raw.length, t1.index)
      const hasMult = /[xX×]/.test(between)
      const hasUnitWord = unitWordRegex.test(between)
      const calc = t0.value * t1.value
      const exactMatch =
        subtotal > 0 && Math.abs(calc - subtotal) / subtotal < 0.05
      // Loose trust: ada unit word ("Pcs", "Kg") + "x" → percaya struktur QTY×UNIT
      // walaupun receipt sendiri math-nya off sedikit
      const looseMatch =
        hasMult &&
        hasUnitWord &&
        subtotal > 0 &&
        Math.abs(calc - subtotal) / subtotal < 0.15
      if (exactMatch || looseMatch) {
        qty = Math.max(1, Math.round(t0.value))
        unitPrice = Math.round(subtotal / qty)
      }
    }
  }
  // Rule 3: 2 tokens dengan explicit "QTY [UNIT] x UNITPRICE" tanpa subtotal terpisah
  // (OCR sering misah baris harga total dari line item)
  else if (tokens.length === 2) {
    const t0 = tokens[0]
    const t1 = tokens[1]
    if (t0 !== last && t0.value >= 1 && t1.value >= 100) {
      const between = line.slice(t0.index + t0.raw.length, t1.index)
      const hasMult = /[xX×]/.test(between)
      const hasUnitWord = unitWordRegex.test(between)
      // Wajib EXPLICIT signal: ada "x" DAN ada unit word (Pcs, Kg, dll)
      if (hasMult && hasUnitWord) {
        qty = Math.max(1, Math.round(t0.value))
        unitPrice = t1.value
      }
    }
  }

  if (unitPrice < 100) return null
  if (isUrlLike(name)) return null
  if (name.length < 2) return null

  return { name, qty, unitPrice }
}

export function parseReceipt(text: string): Item[] {
  const lines = text.split('\n')
  const items: Item[] = []
  let pendingName: string | null = null

  for (const rawLine of lines) {
    let trimmed = rawLine.trim()
    if (!trimmed) continue

    // Strip leading item number "1. " "12. " (numbered list di struk)
    trimmed = trimmed.replace(/^\d+\.\s+/, '')
    if (!trimmed) continue

    if (isJunkLine(trimmed)) continue
    if (shouldSkip(trimmed)) continue

    const tokens = findNumberTokens(trimmed)

    if (tokens.length === 0) {
      const candidate = cleanName(trimmed)
      if (candidate.length >= 2 && hasAlpha(candidate) && !shouldSkip(candidate)) {
        pendingName = candidate
      }
      continue
    }

    const parsed = parseTokenLine(trimmed, tokens, pendingName)
    if (parsed) {
      // Totals-protection: kalau item baru nilainya ≥ 80% sum item sebelumnya,
      // kemungkinan besar ini line TOTAL/SUBTOTAL yang lolos skip filter
      const itemTotal = parsed.qty * parsed.unitPrice
      if (items.length >= 2) {
        const existingSum = items.reduce(
          (s, it) => s + it.qty * it.unitPrice,
          0,
        )
        if (itemTotal >= existingSum * 0.8) {
          // Skip suspected totals line, jangan reset pendingName supaya
          // line item berikutnya (kalau ada) masih bisa pakai nama
          continue
        }
      }
      items.push({
        id: uuid(),
        name: parsed.name,
        qty: parsed.qty,
        unitPrice: parsed.unitPrice,
        taggedPersonIds: [],
      })
      pendingName = null
    } else {
      // Parse gagal — coba extract candidate name dari text yang ada
      const before = trimmed.slice(0, tokens[0].index).trim()
      let candidate = cleanName(before)
      if (!candidate || candidate.length < 2 || !hasAlpha(candidate)) {
        // Strip semua angka dari line, ambil sisa text
        candidate = cleanName(trimmed.replace(/[\d.,]+/g, ' '))
      }
      if (candidate.length >= 2 && hasAlpha(candidate) && !shouldSkip(candidate)) {
        pendingName = candidate
      }
    }
  }

  return dedupe(items)
}

function dedupe(items: Item[]): Item[] {
  const out: Item[] = []
  for (const it of items) {
    const prev = out[out.length - 1]
    if (
      prev &&
      prev.name.toLowerCase() === it.name.toLowerCase() &&
      prev.unitPrice === it.unitPrice &&
      prev.qty === it.qty
    ) {
      continue
    }
    out.push(it)
  }
  return out
}

interface DetectedTotals {
  taxPercent?: number
  servicePercent?: number
  subtotal?: number
}

export function detectTotals(text: string): DetectedTotals {
  const result: DetectedTotals = {}
  const lower = text.toLowerCase()

  const taxMatch = lower.match(/(?:pb1|ppn|pajak|tax)[^\d]*(\d{1,2})\s*%/)
  if (taxMatch) {
    const pct = parseInt(taxMatch[1], 10)
    if (pct > 0 && pct <= 25) result.taxPercent = pct
  }

  const svcMatch = lower.match(/(?:service|svc|sc)[^\d]*(\d{1,2})\s*%/)
  if (svcMatch) {
    const pct = parseInt(svcMatch[1], 10)
    if (pct > 0 && pct <= 25) result.servicePercent = pct
  }

  return result
}
