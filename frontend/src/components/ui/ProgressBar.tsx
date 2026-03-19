interface Props {
  value: number   // 0–100
  color?: string  // tailwind bg color class
}

export function ProgressBar({ value, color = 'bg-indigo' }: Props) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full h-1.5 bg-neutral rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
