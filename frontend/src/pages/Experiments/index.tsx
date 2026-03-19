import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { PermissionGuard } from '../../components/shared/PermissionGuard'
import { CreateExperimentModal } from './CreateExperimentModal'
import { mockExperiments } from '../../data/mock-data'
import type { Experiment } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ExperimentsPage() {
  const navigate = useNavigate()
  const [experiments, setExperiments] = useState(mockExperiments)
  const [showCreate, setShowCreate]   = useState(false)

  function handleCreate(exp: Experiment) {
    setExperiments(prev => [exp, ...prev])
    setShowCreate(false)
    navigate(`/experiments/${exp.experiment_id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">Experiments</h1>
          <p className="text-sm text-gray-text mt-1">{experiments.length} experiments</p>
        </div>
        <PermissionGuard roles={['admin']}>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Create Experiment
          </button>
        </PermissionGuard>
      </div>

      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral bg-neutral/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-text">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Benchmark</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Models</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Progress</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {experiments.map(exp => {
              const pct = Math.round((exp.progress.completed / exp.progress.total) * 100)
              return (
                <tr key={exp.experiment_id} className="hover:bg-neutral/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{exp.name}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-text">{exp.benchmark_name}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {exp.model_names.map(m => (
                        <Badge key={m} variant="gray">{m}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={exp.status === 'active' ? 'indigo' : 'emerald'}>
                      {exp.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 min-w-[140px]">
                    <div className="space-y-1">
                      <ProgressBar value={pct} color={exp.status === 'completed' ? 'bg-emerald' : 'bg-indigo'} />
                      <p className="text-xs text-gray-text">{exp.progress.completed}/{exp.progress.total}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-text">{formatDate(exp.created_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/experiments/${exp.experiment_id}`)}
                        className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded-full hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => navigate(`/experiments/${exp.experiment_id}/results`)}
                        className="text-xs font-medium px-3 py-1.5 border border-neutral rounded-full hover:bg-neutral transition-all duration-300"
                      >
                        Results
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateExperimentModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}
