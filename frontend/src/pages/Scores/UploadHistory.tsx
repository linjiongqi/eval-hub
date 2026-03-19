import { Badge } from '../../components/ui/Badge'
import { mockScoreUploadLogs } from '../../data/mock-data'

const statusVariant = {
  success:    'emerald',
  failed:     'orange',
  processing: 'indigo',
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function UploadHistory() {
  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral">
        <h2 className="text-sm font-semibold">Upload History</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral bg-neutral/50">
            {['Metric', 'Model', 'Benchmark', 'Samples', 'Uploaded By', 'Date', 'Status'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-text first:pl-6">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral">
          {mockScoreUploadLogs.map(log => (
            <tr key={log.id} className="hover:bg-neutral/20 transition-colors">
              <td className="pl-6 pr-4 py-3 font-mono text-xs">{log.metric_name}</td>
              <td className="px-4 py-3 text-sm font-medium">{log.model_name}</td>
              <td className="px-4 py-3 text-xs text-gray-text">{log.benchmark_name}</td>
              <td className="px-4 py-3 text-xs text-gray-text">{log.sample_count}</td>
              <td className="px-4 py-3 text-xs text-gray-text">{log.uploaded_by}</td>
              <td className="px-4 py-3 text-xs text-gray-text">{formatDate(log.uploaded_at)}</td>
              <td className="px-4 py-3">
                <div>
                  <Badge variant={statusVariant[log.status]} className="capitalize">{log.status}</Badge>
                  {log.error_msg && (
                    <p className="text-[10px] text-red-400 mt-0.5 max-w-[180px] truncate">{log.error_msg}</p>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
