import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { mockVotes } from '../../data/mock-data'
import type { Experiment } from '../../types'

interface Props { experiment: Experiment }

export function WinRateCards({ experiment }: Props) {
  const votes = mockVotes.filter(v => v.experiment_id === experiment.experiment_id)
  const total = votes.length || 1

  const counts = { modelA: 0, modelB: 0, tieSkip: 0 }
  votes.forEach(v => {
    if (v.is_tie || v.is_skipped) counts.tieSkip++
    else if (v.winner_model_id === experiment.model_ids[0]) counts.modelA++
    else if (v.winner_model_id === experiment.model_ids[1]) counts.modelB++
  })

  const pctA    = Math.round((counts.modelA  / total) * 100)
  const pctB    = Math.round((counts.modelB  / total) * 100)
  const pctTie  = Math.round((counts.tieSkip / total) * 100)

  const chartData = [{ name: 'Votes', modelA: pctA, modelB: pctB, tieSkip: pctTie }]

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: experiment.model_names[0], pct: pctA, color: 'text-indigo', bg: 'bg-indigo-50' },
          { label: experiment.model_names[1], pct: pctB, color: 'text-emerald', bg: 'bg-emerald-50' },
          { label: 'Tie / Skip',              pct: pctTie, color: 'text-gray-text', bg: 'bg-neutral' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-heading font-semibold ${item.color}`}>{item.pct}%</p>
            <p className="text-xs text-gray-text mt-1 truncate">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Stacked bar */}
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barSize={32}>
            <XAxis type="number" domain={[0, 100]} hide />
            <Tooltip formatter={(v: unknown) => `${v}%`} />
            <Bar dataKey="modelA" stackId="a" fill="#6366F1" radius={[4,0,0,4]} />
            <Bar dataKey="modelB" stackId="a" fill="#10B981" />
            <Bar dataKey="tieSkip" stackId="a" fill="#E5E7EB" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-text text-center">{votes.length} total votes</p>
    </div>
  )
}
