import { useNavigate } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { mockExperiments } from '../../data/mock-data'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function RecentExperiments() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent Experiments</h2>
        <button
          onClick={() => navigate('/experiments')}
          className="text-xs text-gray-text hover:text-black transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="divide-y divide-neutral">
        {mockExperiments.map(exp => {
          const pct = Math.round((exp.progress.completed / exp.progress.total) * 100)
          return (
            <div
              key={exp.experiment_id}
              onClick={() => navigate(`/experiments/${exp.experiment_id}`)}
              className="px-6 py-4 hover:bg-neutral/40 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{exp.name}</p>
                  <p className="text-xs text-gray-text mt-0.5">{exp.benchmark_name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.model_names.map(m => (
                      <Badge key={m} variant="gray">{m}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right space-y-2">
                  <Badge variant={exp.status === 'active' ? 'indigo' : 'emerald'}>
                    {exp.status === 'active' ? 'Active' : 'Completed'}
                  </Badge>
                  <p className="text-xs text-gray-text">{formatDate(exp.created_at)}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-text mb-1">
                  <span>Progress</span>
                  <span>{exp.progress.completed}/{exp.progress.total}</span>
                </div>
                <ProgressBar value={pct} color={exp.status === 'completed' ? 'bg-emerald' : 'bg-indigo'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
