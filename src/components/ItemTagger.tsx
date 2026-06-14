import { ChevronRight } from 'lucide-react'
import { useSplitStore } from '../store/useSplitStore'
import { formatRupiah, lineTotal } from '../lib/calculator'
import { Stepper } from './shared/Stepper'
import { Card, BottomBar } from './shared/Card'
import { GhostBtn, PrimaryBtn } from './shared/Buttons'

export default function ItemTagger() {
  const { items, people, toggleTag, tagAllToAll, setStep } = useSplitStore()
  const untagged = items.filter((it) => it.taggedPersonIds.length === 0)

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <Stepper step={4} />
      </div>

      <div className="px-4 pb-3">
        <h2 className="font-bold text-xl" style={{ letterSpacing: '-0.02em' }}>
          Siapa Makan Apa?
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tap nama untuk assign item ke orang
        </p>
        <button
          onClick={tagAllToAll}
          className="mt-1.5 text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-primary)' }}
        >
          Patungan semua? Tag semua ke semua item →
        </button>
      </div>

      {untagged.length > 0 && (
        <div
          className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-medium"
          style={{
            backgroundColor: 'rgba(176,122,79,0.12)',
            color: 'var(--accent-secondary)',
          }}
        >
          <span>⚠️</span>
          <span>{untagged.length} item belum di-tag siapapun</span>
        </div>
      )}

      <div className="flex-1 px-4 space-y-3 overflow-auto pb-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.qty}× {formatRupiah(item.unitPrice)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span
                    className="font-bold text-sm tnum"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {formatRupiah(lineTotal(item))}
                  </span>
                  {item.taggedPersonIds.length > 1 && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(139,90,60,0.12)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      Patungan {item.taggedPersonIds.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div
              className="border-t px-4 py-3 flex flex-wrap gap-2"
              style={{ borderColor: 'rgba(43,24,16,0.08)' }}
            >
              {people.map((person) => {
                const active = item.taggedPersonIds.includes(person.id)
                return (
                  <button
                    key={person.id}
                    onClick={() => toggleTag(item.id, person.id)}
                    className="h-8 px-3 rounded-full text-xs font-semibold transition-all duration-150"
                    style={
                      active
                        ? {
                            backgroundColor: person.color,
                            color: '#fff',
                            border: `2px solid ${person.color}`,
                            transform: 'scale(1.04)',
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: 'var(--text-muted)',
                            border: `2px solid ${person.color}55`,
                          }
                    }
                  >
                    {person.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      <BottomBar>
        <GhostBtn onClick={() => setStep('people')}>Kembali</GhostBtn>
        <PrimaryBtn onClick={() => setStep('summary')} full>
          Lihat Hasil <ChevronRight size={16} />
        </PrimaryBtn>
      </BottomBar>
    </div>
  )
}
