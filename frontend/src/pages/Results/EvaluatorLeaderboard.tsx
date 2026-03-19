import { mockVotes, mockUsers } from '../../data/mock-data'
import type { Experiment } from '../../types'

interface Props { experiment: Experiment }

export function EvaluatorLeaderboard({ experiment }: Props) {
  const votes = mockVotes.filter(v => v.experiment_id === experiment.experiment_id)
  const total = experiment.progress.total

  const counts = experiment.evaluator_ids.map(uid => ({
    user: mockUsers.find(u => u.user_id === uid),
    count: votes.filter(v => v.evaluator_id === uid && !v.is_skipped).length,
  })).sort((a, b) => b.count - a.count)

  function initials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="bg-surface rounded-card shadow-card p-5">
      <h2 className="text-sm font-semibold mb-4">Evaluator Progress</h2>
      <div className="space-y-3">
        {counts.map(({ user, count }, i) => {
          if (!user) return null
          const pct = Math.round((count / total) * 100)
          return (
            <div key={user.user_id} className="flex items-center gap-3">
              <span className="text-xs text-gray-text w-4">{i + 1}</span>
              <div className="w-7 h-7 rounded-full bg-indigo flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                {initials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="text-gray-text flex-shrink-0 ml-2">{count}/{total}</span>
                </div>
                <div className="h-1 bg-neutral rounded-full overflow-hidden">
                  <div className="h-full bg-indigo rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
