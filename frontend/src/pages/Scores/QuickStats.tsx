import { mockMetrics, mockObjectiveScores, mockScoreUploadLogs } from '../../data/mock-data'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function QuickStats() {
  const lastUpload = mockScoreUploadLogs
    .filter(l => l.status === 'success')
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0]

  return (
    <div className="bg-surface rounded-card shadow-card p-5 space-y-4">
      <h2 className="text-sm font-semibold">Quick Stats</h2>
      <div className="space-y-3">
        <div className="p-3 bg-neutral rounded-xl">
          <p className="text-xs text-gray-text">Total Metrics</p>
          <p className="text-xl font-heading font-semibold mt-1">{mockMetrics.length}</p>
        </div>
        <div className="p-3 bg-neutral rounded-xl">
          <p className="text-xs text-gray-text">Total Score Records</p>
          <p className="text-xl font-heading font-semibold mt-1">{mockObjectiveScores.length}</p>
        </div>
        <div className="p-3 bg-neutral rounded-xl">
          <p className="text-xs text-gray-text">Last Upload</p>
          <p className="text-sm font-medium mt-1">{lastUpload ? formatDate(lastUpload.uploaded_at) : '—'}</p>
        </div>
      </div>
    </div>
  )
}
