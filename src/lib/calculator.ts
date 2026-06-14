import type { Item, Person, PersonBreakdown, Split } from '../types'

export function lineTotal(item: Item): number {
  return item.qty * item.unitPrice
}

export function subtotalAll(items: Item[]): number {
  return items.reduce((sum, it) => sum + lineTotal(it), 0)
}

export function calculateBreakdown(split: Split): PersonBreakdown[] {
  const { items, people, taxPercent, servicePercent, discountAmount } = split

  // Per-person subtotal from tagged items
  const personSubtotals = new Map<string, number>()
  const personItems = new Map<string, { name: string; share: number }[]>()
  people.forEach((p) => {
    personSubtotals.set(p.id, 0)
    personItems.set(p.id, [])
  })

  for (const item of items) {
    const tagged = item.taggedPersonIds.filter((id) =>
      people.some((p) => p.id === id),
    )
    if (tagged.length === 0) continue
    const total = lineTotal(item)
    const share = total / tagged.length
    for (const pid of tagged) {
      personSubtotals.set(pid, (personSubtotals.get(pid) ?? 0) + share)
      personItems.get(pid)?.push({ name: item.name, share })
    }
  }

  const grandSubtotal = Array.from(personSubtotals.values()).reduce(
    (s, v) => s + v,
    0,
  )

  const totalTax = (grandSubtotal * taxPercent) / 100
  const totalService = (grandSubtotal * servicePercent) / 100
  const totalDiscount = discountAmount

  return people.map((person) => {
    const subtotal = personSubtotals.get(person.id) ?? 0
    const proportion = grandSubtotal > 0 ? subtotal / grandSubtotal : 0
    const tax = totalTax * proportion
    const service = totalService * proportion
    const discount = totalDiscount * proportion
    const total = subtotal + tax + service - discount

    return {
      person,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      service: Math.round(service),
      discount: Math.round(discount),
      total: Math.round(total),
      items: personItems.get(person.id) ?? [],
    }
  })
}

export function grandTotal(split: Split): number {
  const sub = subtotalAll(split.items)
  const tax = (sub * split.taxPercent) / 100
  const service = (sub * split.servicePercent) / 100
  return Math.round(sub + tax + service - split.discountAmount)
}

export function formatRupiah(amount: number): string {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID')
}

const PERSON_COLORS = [
  '#8B5A3C',
  '#A0522D',
  '#6B4423',
  '#B07A4F',
  '#C68B59',
  '#7A4825',
  '#9C6B3F',
  '#5C3818',
  '#D4A373',
  '#B68660',
]

export function nextPersonColor(existing: Person[]): string {
  const used = new Set(existing.map((p) => p.color))
  for (const c of PERSON_COLORS) {
    if (!used.has(c)) return c
  }
  return PERSON_COLORS[existing.length % PERSON_COLORS.length]
}
