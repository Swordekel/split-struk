import { useState } from 'react'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useSplitStore } from '../store/useSplitStore'
import { Stepper } from './shared/Stepper'
import { Card, BottomBar } from './shared/Card'
import { GhostBtn, PrimaryBtn } from './shared/Buttons'
import { Avatar } from './shared/Avatar'

export default function PeoplePicker() {
  const { people, addPerson, updatePerson, removePerson, setStep } =
    useSplitStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addPerson(trimmed, phone.trim() || undefined)
    setName('')
    setPhone('')
  }

  const inputStyle: React.CSSProperties = {
    border: '1.5px solid var(--border-medium, rgba(43,24,16,0.14))',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <Stepper step={3} />
      </div>

      <div className="px-4 pb-4">
        <h2 className="font-bold text-xl" style={{ letterSpacing: '-0.02em' }}>
          Siapa Aja?
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tambah orang yang ikut patungan
        </p>
      </div>

      <div className="flex-1 px-4 space-y-3 overflow-auto pb-4">
        <Card className="p-4">
          <div className="space-y-2 mb-3">
            <input
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full h-11 rounded-xl px-3 text-sm outline-none"
              style={inputStyle}
            />
            <input
              placeholder="No. HP (opsional — untuk WA langsung)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full h-11 rounded-xl px-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full h-10 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <Plus size={15} /> Tambah
          </button>
        </Card>

        {people.length === 0 ? (
          <div
            className="text-center py-8 rounded-2xl border-2 border-dashed text-sm text-muted-foreground"
            style={{ borderColor: 'var(--border-medium)' }}
          >
            Belum ada orang. Tambah minimal 1.
          </div>
        ) : (
          people.map((p) => (
            <Card key={p.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} color={p.color} size="md" />
                <div className="flex-1 min-w-0">
                  <input
                    value={p.name}
                    onChange={(e) =>
                      updatePerson(p.id, { name: e.target.value })
                    }
                    className="w-full font-semibold text-sm bg-transparent border-none outline-none"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <input
                    value={p.phone ?? ''}
                    onChange={(e) =>
                      updatePerson(p.id, { phone: e.target.value })
                    }
                    placeholder="No. HP"
                    className="w-full text-xs text-muted-foreground bg-transparent border-none outline-none"
                  />
                </div>
                <button
                  onClick={() => removePerson(p.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomBar>
        <GhostBtn onClick={() => setStep('items')}>Kembali</GhostBtn>
        <PrimaryBtn
          onClick={() => setStep('tag')}
          disabled={people.length === 0}
          full
        >
          Lanjut <ChevronRight size={16} />
        </PrimaryBtn>
      </BottomBar>
    </div>
  )
}
