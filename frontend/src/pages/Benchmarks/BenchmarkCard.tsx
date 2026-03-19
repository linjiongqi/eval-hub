import { Icon } from '@iconify/react'
import { Badge } from '../../components/ui/Badge'
import type { Benchmark } from '../../types'

const statusVariant: Record<Benchmark['status'], 'emerald' | 'indigo' | 'gray'> = {
  current:    'emerald',
  production: 'indigo',
  legacy:     'gray',
}

interface Props {
  benchmark: Benchmark
  onClick: () => void
  onEdit?: () => void
  onDelete?: () => void
  isAdmin: boolean
}

export function BenchmarkCard({ benchmark, onClick, onEdit, onDelete, isAdmin }: Props) {
  const thumbnails = benchmark.samples.slice(0, 3)

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-card shadow-card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading font-semibold text-base truncate">{benchmark.name}</h3>
          <p className="text-xs text-gray-text mt-0.5">{benchmark.benchmark_id}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <Badge variant={statusVariant[benchmark.status]} className="capitalize">
            {benchmark.status}
          </Badge>
          <Badge variant="gray">{benchmark.version}</Badge>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mb-4">
        {thumbnails.map(s => (
          <div key={s.sample_id} className="w-16 h-16 rounded-xl overflow-hidden bg-neutral flex-shrink-0">
            <img src={s.ref_image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {benchmark.sample_count > 3 && (
          <div className="w-16 h-16 rounded-xl bg-neutral flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-gray-text font-medium">+{benchmark.sample_count - 3}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-text">
          <span className="font-semibold text-gray-700">{benchmark.sample_count}</span> samples
        </span>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit?.() }}
              className="p-1.5 rounded-lg hover:bg-neutral transition-colors"
              title="Edit"
            >
              <Icon icon="lucide:pencil" className="w-3.5 h-3.5 text-gray-text" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete?.() }}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
