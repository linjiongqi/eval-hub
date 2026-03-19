import { useState } from 'react'
import { Icon } from '@iconify/react'
import { mockBenchmarks, mockModels, mockUsers } from '../../data/mock-data'
import type { Experiment } from '../../types'

interface Props {
  onClose: () => void
  onCreate: (exp: Experiment) => void
}

export function CreateExperimentModal({ onClose, onCreate }: Props) {
  const [name, setName]               = useState('')
  const [benchmarkId, setBenchmarkId] = useState('')
  const [modelIds, setModelIds]       = useState<string[]>([])
  const [evaluatorIds, setEvaluatorIds] = useState<string[]>([])

  const evaluators = mockUsers.filter(u => u.role !== 'viewer' && u.is_active)

  function toggleModel(id: string) {
    setModelIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  function toggleEvaluator(id: string) {
    setEvaluatorIds(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (modelIds.length < 2) { alert('Select at least 2 models'); return }
    if (evaluatorIds.length === 0) { alert('Assign at least 1 evaluator'); return }

    const benchmark = mockBenchmarks.find(b => b.benchmark_id === benchmarkId)!
    const newExp: Experiment = {
      experiment_id: `exp-${Date.now()}`,
      name: name.trim(),
      benchmark_id: benchmarkId,
      benchmark_name: benchmark.name,
      model_ids: modelIds,
      model_names: modelIds.map(id => mockModels.find(m => m.model_id === id)!.name),
      display_labels: modelIds.map((_, i) => `Model ${String.fromCharCode(65 + i)}`),
      evaluator_ids: evaluatorIds,
      status: 'active',
      progress: { completed: 0, total: benchmark.sample_count },
      created_at: new Date().toISOString(),
    }
    onCreate(newExp)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between flex-shrink-0">
          <h2 className="font-heading font-semibold">Create Experiment</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Experiment Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. AvatarIV v2.1 vs Tokyo v3.0" required
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Benchmark */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Benchmark</label>
            <select
              value={benchmarkId} onChange={e => setBenchmarkId(e.target.value)} required
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="">Select benchmark…</option>
              {mockBenchmarks.map(b => (
                <option key={b.benchmark_id} value={b.benchmark_id}>{b.name} ({b.version})</option>
              ))}
            </select>
          </div>

          {/* Models */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Models <span className="text-gray-text">(select 2+, order determines label)</span>
            </label>
            <div className="space-y-2">
              {mockModels.map((model) => {
                const idx = modelIds.indexOf(model.model_id)
                const checked = idx !== -1
                return (
                  <label key={model.model_id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral hover:bg-neutral/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox" checked={checked}
                      onChange={() => toggleModel(model.model_id)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium flex-1">{model.name}</span>
                    <span className="text-xs text-gray-text">{model.version}</span>
                    {checked && (
                      <span className="text-xs font-semibold text-indigo bg-indigo-50 px-2 py-0.5 rounded-full">
                        Model {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Evaluators */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Evaluators</label>
            <div className="space-y-2">
              {evaluators.map(u => (
                <label key={u.user_id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral hover:bg-neutral/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={evaluatorIds.includes(u.user_id)}
                    onChange={() => toggleEvaluator(u.user_id)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium flex-1">{u.name}</span>
                  <span className="text-xs text-gray-text capitalize">{u.role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-neutral rounded-full py-2.5 text-sm font-medium hover:bg-neutral transition-all duration-300">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-black text-white rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
