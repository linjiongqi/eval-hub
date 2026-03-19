import { mockActivityLogs } from '../../data/mock-data'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  'bg-indigo', 'bg-emerald', 'bg-orange',
  'bg-purple-400', 'bg-blue-400', 'bg-pink-400',
]

export function ActivityFeed() {
  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral">
        <h2 className="text-sm font-semibold">Activity</h2>
      </div>
      <div className="divide-y divide-neutral max-h-96 overflow-y-auto">
        {mockActivityLogs.map((log, i) => (
          <div key={log.id} className="px-6 py-3 flex items-start gap-3">
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold ${avatarColors[i % avatarColors.length]}`}>
              {initials(log.user_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-800 leading-relaxed">
                <span className="font-medium">{log.user_name}</span>
                {' '}{log.action}{' '}
                <span className="font-mono text-indigo text-[11px]">{log.entity}</span>
              </p>
              <p className="text-[11px] text-gray-text mt-0.5">{timeAgo(log.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
