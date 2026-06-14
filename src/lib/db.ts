import Dexie, { type Table } from 'dexie'
import type { Split } from '../types'

class SplitStrukDB extends Dexie {
  splits!: Table<Split, number>

  constructor() {
    super('splitstruk')
    this.version(1).stores({
      splits: '++id, createdAt, title',
    })
  }
}

export const db = new SplitStrukDB()

export async function saveSplit(split: Omit<Split, 'id'>): Promise<number> {
  return await db.splits.add(split as Split)
}

export async function updateSplit(id: number, patch: Partial<Split>): Promise<void> {
  await db.splits.update(id, patch)
}

export async function getSplit(id: number): Promise<Split | undefined> {
  return await db.splits.get(id)
}

export async function getAllSplits(): Promise<Split[]> {
  return await db.splits.orderBy('createdAt').reverse().toArray()
}

export async function deleteSplit(id: number): Promise<void> {
  await db.splits.delete(id)
}
