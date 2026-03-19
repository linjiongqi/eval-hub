import { mockObjectiveScores } from '../../data/mock-data'
import type { Experiment } from '../../types'

const DISPLAY_METRICS = [
  { key: 'lip_sync',              label: 'Lip Sync' },
  { key: 'clarity',               label: 'Clarity' },
  { key: 'naturalness',           label: 'Naturalness' },
  { key: 'motion_quality',        label: 'Motion Quality' },
  { key: 'identity_preservation', label: 'Identity Preservation' },
]

function calcStats(scores: number[]) {
  if (!scores.length) return { mean: 0, std: 0 }
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const std  = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length)
  return { mean, std }
}

interface Props { experiment: Experiment }

export function ObjectiveScoreTable({ experiment }: Props) {
  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral">
        <h2 className="text-sm font-semibold">Objective Score Comparison</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral bg-neutral/50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-text">Metric</th>
            {experiment.model_names.map(name => (
              <th key={name} className="text-center px-4 py-3 text-xs font-semibold text-gray-text">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral">
          {DISPLAY_METRICS.map(({ key, label }) => {
            const statsByModel = experiment.model_ids.map(mid => {
              const scores = mockObjectiveScores
                .filter(s => s.model_id === mid && s.benchmark_id === experiment.benchmark_id && s.metric_name === key)
                .map(s => s.score)
              return calcStats(scores)
            })

            const means  = statsByModel.map(s => s.mean)
            const maxIdx = means.indexOf(Math.max(...means))
            const minIdx = means.indexOf(Math.min(...means))

            return (
              <tr key={key} className="hover:bg-neutral/20">
                <td className="px-6 py-3 font-medium text-sm">{label}</td>
                {statsByModel.map((stat, i) => {
                  const isMax = i === maxIdx && means[0] !== means[1]
                  const isMin = i === minIdx && means[0] !== means[1]
                  return (
                    <td key={i} className={`px-4 py-3 text-center font-mono text-xs ${
                      isMax ? 'bg-emerald-50 text-emerald font-semibold' :
                      isMin ? 'bg-orange-50 text-orange font-semibold' : 'text-gray-700'
                    }`}>
                      {stat.mean.toFixed(3)} ± {stat.std.toFixed(3)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
