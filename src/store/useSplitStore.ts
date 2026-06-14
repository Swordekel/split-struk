import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { Item, Person, Split, WizardStep } from '../types'
import { nextPersonColor } from '../lib/calculator'

interface SplitState {
  title: string
  items: Item[]
  people: Person[]
  taxPercent: number
  servicePercent: number
  discountAmount: number
  receiptImage?: Blob
  rawOcrText?: string
  step: WizardStep

  setTitle: (t: string) => void
  setStep: (s: WizardStep) => void
  setReceiptImage: (b?: Blob) => void
  setRawOcrText: (t?: string) => void

  setItems: (items: Item[]) => void
  addItem: () => void
  updateItem: (id: string, patch: Partial<Item>) => void
  removeItem: (id: string) => void
  toggleTag: (itemId: string, personId: string) => void
  tagAllToPerson: (personId: string) => void
  tagAllToAll: () => void

  addPerson: (name: string, phone?: string) => void
  updatePerson: (id: string, patch: Partial<Person>) => void
  removePerson: (id: string) => void

  setTaxPercent: (n: number) => void
  setServicePercent: (n: number) => void
  setDiscountAmount: (n: number) => void

  reset: () => void
  loadFromSplit: (s: Split) => void
  toSplit: () => Omit<Split, 'id'>
}

function defaultTitle(): string {
  const now = new Date()
  return `Bagi Tagihan ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
}

const INITIAL: Pick<
  SplitState,
  | 'title'
  | 'items'
  | 'people'
  | 'taxPercent'
  | 'servicePercent'
  | 'discountAmount'
  | 'receiptImage'
  | 'rawOcrText'
  | 'step'
> = {
  title: defaultTitle(),
  items: [],
  people: [],
  taxPercent: 0,
  servicePercent: 0,
  discountAmount: 0,
  receiptImage: undefined,
  rawOcrText: undefined,
  step: 'upload',
}

export const useSplitStore = create<SplitState>((set, get) => ({
  ...INITIAL,

  setTitle: (title) => set({ title }),
  setStep: (step) => set({ step }),
  setReceiptImage: (receiptImage) => set({ receiptImage }),
  setRawOcrText: (rawOcrText) => set({ rawOcrText }),

  setItems: (items) => set({ items }),
  addItem: () =>
    set((s) => ({
      items: [
        ...s.items,
        { id: uuid(), name: '', qty: 1, unitPrice: 0, taggedPersonIds: [] },
      ],
    })),
  updateItem: (id, patch) =>
    set((s) => ({
      items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    })),
  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((it) => it.id !== id) })),

  toggleTag: (itemId, personId) =>
    set((s) => ({
      items: s.items.map((it) => {
        if (it.id !== itemId) return it
        const has = it.taggedPersonIds.includes(personId)
        return {
          ...it,
          taggedPersonIds: has
            ? it.taggedPersonIds.filter((p) => p !== personId)
            : [...it.taggedPersonIds, personId],
        }
      }),
    })),

  tagAllToPerson: (personId) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.taggedPersonIds.includes(personId)
          ? it
          : { ...it, taggedPersonIds: [...it.taggedPersonIds, personId] },
      ),
    })),

  tagAllToAll: () =>
    set((s) => ({
      items: s.items.map((it) => ({
        ...it,
        taggedPersonIds: s.people.map((p) => p.id),
      })),
    })),

  addPerson: (name, phone) =>
    set((s) => ({
      people: [
        ...s.people,
        { id: uuid(), name, phone, color: nextPersonColor(s.people) },
      ],
    })),

  updatePerson: (id, patch) =>
    set((s) => ({
      people: s.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  removePerson: (id) =>
    set((s) => ({
      people: s.people.filter((p) => p.id !== id),
      items: s.items.map((it) => ({
        ...it,
        taggedPersonIds: it.taggedPersonIds.filter((pid) => pid !== id),
      })),
    })),

  setTaxPercent: (n) => set({ taxPercent: n }),
  setServicePercent: (n) => set({ servicePercent: n }),
  setDiscountAmount: (n) => set({ discountAmount: n }),

  reset: () => set({ ...INITIAL, title: defaultTitle() }),

  loadFromSplit: (s) =>
    set({
      title: s.title,
      items: s.items,
      people: s.people,
      taxPercent: s.taxPercent,
      servicePercent: s.servicePercent,
      discountAmount: s.discountAmount,
      receiptImage: s.receiptImage,
      step: 'summary',
    }),

  toSplit: () => {
    const s = get()
    return {
      createdAt: new Date(),
      title: s.title,
      items: s.items,
      people: s.people,
      taxPercent: s.taxPercent,
      servicePercent: s.servicePercent,
      discountAmount: s.discountAmount,
      receiptImage: s.receiptImage,
    }
  },
}))
