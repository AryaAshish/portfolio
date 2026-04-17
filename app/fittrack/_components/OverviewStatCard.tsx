export function OverviewStatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-3">
      <p className="text-[10px] font-semibold text-[#999] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-grotesk text-xl font-bold text-[#1a1a1a] leading-none mb-0.5">
        {value}
      </p>
      {sub ? <p className="text-[10px] text-[#bbb]">{sub}</p> : null}
    </div>
  )
}
