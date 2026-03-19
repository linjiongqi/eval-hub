interface Props {
  value: number  // 0–1
  color?: string
}

export function MiniBarChart({ value, color = '#6366F1' }: Props) {
  const pct = Math.min(1, Math.max(0, value)) * 100
  return (
    <div className="flex items-center gap-1.5 w-20">
      <div className="flex-1 h-1.5 bg-neutral rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] text-gray-text w-6 text-right">{value.toFixed(2)}</span>
    </div>
  )
}
