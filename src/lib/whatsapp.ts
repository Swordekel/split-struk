import type { PersonBreakdown, Split } from '../types'
import { formatRupiah } from './calculator'

function buildMessage(breakdown: PersonBreakdown, split: Split): string {
  const lines: string[] = []
  lines.push(`Halo ${breakdown.person.name}! 👋`)
  lines.push('')
  lines.push(`Berikut tagihan kamu dari *${split.title}*:`)
  lines.push('')

  for (const it of breakdown.items) {
    lines.push(`• ${it.name} — ${formatRupiah(it.share)}`)
  }

  lines.push('')
  lines.push(`Subtotal: ${formatRupiah(breakdown.subtotal)}`)
  if (breakdown.tax > 0) lines.push(`Pajak: ${formatRupiah(breakdown.tax)}`)
  if (breakdown.service > 0)
    lines.push(`Service: ${formatRupiah(breakdown.service)}`)
  if (breakdown.discount > 0)
    lines.push(`Diskon: -${formatRupiah(breakdown.discount)}`)
  lines.push('')
  lines.push(`*Total: ${formatRupiah(breakdown.total)}*`)
  lines.push('')
  lines.push('Makasih ya! 🙏')

  return lines.join('\n')
}

function normalizePhone(raw: string): string {
  let phone = raw.replace(/\D/g, '')
  if (phone.startsWith('0')) phone = '62' + phone.slice(1)
  if (phone.startsWith('8')) phone = '62' + phone
  return phone
}

export function buildWhatsAppLink(
  breakdown: PersonBreakdown,
  split: Split,
): string {
  const message = buildMessage(breakdown, split)
  const encoded = encodeURIComponent(message)
  const phone = breakdown.person.phone
    ? normalizePhone(breakdown.person.phone)
    : ''
  return phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`
}

export function buildPlainText(
  breakdown: PersonBreakdown,
  split: Split,
): string {
  return buildMessage(breakdown, split)
}

export function buildShareAllText(
  breakdowns: PersonBreakdown[],
  split: Split,
): string {
  const lines: string[] = []
  lines.push(`*Rincian ${split.title}*`)
  lines.push('')
  for (const b of breakdowns) {
    lines.push(`👤 ${b.person.name} — ${formatRupiah(b.total)}`)
  }
  lines.push('')
  lines.push('Dibuat dengan SplitStruk 💚')
  return lines.join('\n')
}
