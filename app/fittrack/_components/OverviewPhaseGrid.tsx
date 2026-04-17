import type { PlanPhase } from '@/fittrack/plan-config'

export function OverviewPhaseGrid({ phases }: { phases: PlanPhase[] }) {
  return (
    <>
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">
        Phase Plan
      </p>
      <div className="space-y-3">
        {phases.map((phase) => {
          const today = new Date()
          const isActive = today >= phase.start && today <= phase.end
          const isDone = today > phase.end
          const isUpcoming = today < phase.start

          return (
            <div
              key={phase.number}
              className="bg-white rounded-[10px] p-4"
              style={{
                border: isActive
                  ? `1.5px solid ${phase.borderActive}`
                  : '1px solid #e8e8e4',
                opacity: isUpcoming ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[4px]"
                      style={{
                        background: isActive || isDone ? phase.accentBg : '#f3f4f6',
                        color: isActive || isDone ? phase.accentText : '#9ca3af',
                      }}
                    >
                      Phase {phase.number}
                    </span>
                    <span className="text-[11px] text-[#999]">Weeks {phase.weeks}</span>
                    {isActive ? (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-[4px]"
                        style={{ background: phase.accentBg, color: phase.accentText }}
                      >
                        Active
                      </span>
                    ) : null}
                    {isDone ? (
                      <span className="text-[10px] font-semibold text-[#16a34a] uppercase tracking-wide">
                        ✓ Done
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-grotesk font-bold text-[#1a1a1a] text-[15px] mb-0.5">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-[#666]">{phase.focus}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-[#999]">
                    {phase.start.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    {' – '}
                    {phase.end.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>

              {isActive ? <PhaseActiveBar phase={phase} /> : null}
            </div>
          )
        })}
      </div>
    </>
  )
}

function PhaseActiveBar({ phase }: { phase: PlanPhase }) {
  const elapsed = Math.floor(
    (new Date().getTime() - phase.start.getTime()) / 86_400_000
  )
  const total = Math.floor(
    (phase.end.getTime() - phase.start.getTime()) / 86_400_000
  )
  const pct = total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 0
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-[#999] mb-1">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: phase.accentBg }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: phase.borderActive,
          }}
        />
      </div>
    </div>
  )
}
