interface Props {
  label: string
  value: number | string
  trend: string
  positive: boolean | null  // true=green, false=red, null=gray
}

export function StatCard({ label, value, trend, positive }: Props) {
  const trendColor =
    positive === true  ? 'text-emerald bg-emerald-50' :
    positive === false ? 'text-red-500 bg-red-50' :
                         'text-gray-text bg-neutral'

  const arrow = positive === true ? '↑' : positive === false ? '↓' : '–'

  return (
    <div className="bg-surface rounded-card shadow-card p-6">
      <p className="text-sm text-gray-text font-medium mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-heading font-semibold tracking-tight">{value}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendColor}`}>
          {arrow} {trend}
        </span>
      </div>
    </div>
  )
}
