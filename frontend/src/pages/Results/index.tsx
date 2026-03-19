import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { WinRateCards } from './WinRateCards'
import { ObjectiveScoreTable } from './ObjectiveScoreTable'
import { SampleDetailTable } from './SampleDetailTable'
import { EvaluatorLeaderboard } from './EvaluatorLeaderboard'
import { mockExperiments } from '../../data/mock-data'

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const experiment = mockExperiments.find(e => e.experiment_id === id)
  if (!experiment) return <div className="text-gray-text">Experiment not found.</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/experiments')} className="p-2 rounded-xl hover:bg-neutral transition-colors">
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">{experiment.name}</h1>
          <p className="text-sm text-gray-text mt-0.5">Results · {experiment.benchmark_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          {/* Win rate */}
          <div className="bg-surface rounded-card shadow-card p-6">
            <h2 className="text-sm font-semibold mb-4">Win Rate</h2>
            <WinRateCards experiment={experiment} />
          </div>

          {/* Objective scores */}
          <ObjectiveScoreTable experiment={experiment} />

          {/* Per-sample details */}
          <SampleDetailTable experiment={experiment} />
        </div>

        {/* Sidebar */}
        <div>
          <EvaluatorLeaderboard experiment={experiment} />
        </div>
      </div>
    </div>
  )
}
