import { Icon } from '@iconify/react'
import { Badge } from '../../components/ui/Badge'
import { mockModelResults, mockBenchmarks } from '../../data/mock-data'
import type { Model } from '../../types'

interface Props {
  model: Model
  onClose: () => void
}

export function ModelDetailPanel({ model, onClose }: Props) {
  // Check which benchmarks have results for this model
  const uploadedBenchmarkIds = new Set(
    mockModelResults
      .filter(r => r.model_id === model.model_id)
      .map(r => r.benchmark_id)
  )

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[420px] bg-surface shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-heading font-semibold">{model.name}</h2>
            <p className="text-xs text-gray-text mt-0.5">{model.type} · {model.version}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Version History Timeline */}
          <div>
            <h3 className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-3">
              Version History
            </h3>
            <div className="space-y-0">
              {model.version_history.map((v, i) => (
                <div key={v.version} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${i === 0 ? 'bg-indigo' : 'bg-neutral border border-gray-300'}`} />
                    {i < model.version_history.length - 1 && (
                      <div className="w-px flex-1 bg-neutral min-h-[24px]" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{v.version}</span>
                      {i === 0 && <Badge variant="indigo">Current</Badge>}
                    </div>
                    <p className="text-xs text-gray-text mt-0.5">
                      {new Date(v.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {v.benchmark_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {v.benchmark_ids.map(bid => (
                          <span key={bid} className="text-[11px] bg-neutral text-gray-text px-1.5 py-0.5 rounded">{bid}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Upload Status */}
          <div>
            <h3 className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-3">
              Benchmark Results
            </h3>
            <div className="space-y-2">
              {mockBenchmarks.map(b => {
                const uploaded = uploadedBenchmarkIds.has(b.benchmark_id)
                return (
                  <div key={b.benchmark_id} className="flex items-center justify-between py-2 border-b border-neutral last:border-0">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-gray-text">{b.version}</p>
                    </div>
                    {uploaded ? (
                      <div className="flex items-center gap-1.5 text-emerald text-xs font-medium">
                        <Icon icon="lucide:check-circle" className="w-4 h-4" />
                        Uploaded
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-text text-xs">
                        <Icon icon="lucide:minus-circle" className="w-4 h-4" />
                        Not uploaded
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
