import { Check } from 'lucide-react'

const STEP_LABELS = ['Upload', 'Item', 'Orang', 'Tag', 'Hasil']

export function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center w-full">
      {STEP_LABELS.map((label, i) => {
        const completed = i < step - 1
        const active = i === step - 1
        return (
          <div key={i} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={
                  completed || active
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: '#fff',
                        boxShadow: active
                          ? '0 0 0 4px rgba(139,90,60,0.18)'
                          : 'none',
                      }
                    : {
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                      }
                }
              >
                {completed ? <Check size={12} strokeWidth={3} /> : i + 1}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className="flex-1 h-px mx-1 mb-4 transition-colors duration-300"
                style={{
                  backgroundColor:
                    i < step - 1
                      ? 'var(--accent-primary)'
                      : 'rgba(139,90,60,0.18)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
