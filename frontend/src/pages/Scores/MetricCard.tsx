
import { Icon } from '@iconify/react'
import { PermissionGuard } from '../../components/shared/PermissionGuard'
import type { Metric } from '../../types'

interface Props {
  metric: Metric
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
}

export function MetricCard({ metric, onEdit, onDelete, onToggleStatus }: Props) {
  return (
    <div className="bg-surface rounded-card shadow-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Icon icon={metric.icon} className="w-5 h-5 text-indigo" />
          </div>
          <div>
            <p className="text-sm font-semibold">{metric.name}</p>
            <p className="text-xs font-mono text-gray-text">{metric.metric_name}</p>
          </div>
        </div>
        <PermissionGuard roles={['admin']}>
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-neutral transition-colors">
              <Icon icon="lucide:pencil" className="w-3.5 h-3.5 text-gray-text" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </PermissionGuard>
      </div>

      <p className="text-xs text-gray-text leading-relaxed">{metric.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs bg-neutral text-gray-text px-2 py-1 rounded-full font-mono">
          {metric.range.min} – {metric.range.max}
        </span>
        <button
          onClick={onToggleStatus}
          className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
            metric.status === 'active'
              ? 'bg-emerald-50 text-emerald'
              : 'bg-neutral text-gray-text'
          }`}
        >
          {metric.status === 'active' ? 'Active' : 'Inactive'}
        </button>
      </div>
    </div>
  )
}
