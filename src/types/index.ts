export interface Item {
  id: string
  name: string
  qty: number
  unitPrice: number
  taggedPersonIds: string[]
}

export interface Person {
  id: string
  name: string
  color: string
  phone?: string
}

export interface Split {
  id?: number
  createdAt: Date
  title: string
  receiptImage?: Blob
  items: Item[]
  people: Person[]
  taxPercent: number
  servicePercent: number
  discountAmount: number
  notes?: string
}

export interface PersonBreakdown {
  person: Person
  subtotal: number
  tax: number
  service: number
  discount: number
  total: number
  items: { name: string; share: number }[]
}

export type WizardStep = 'upload' | 'items' | 'people' | 'tag' | 'summary'
