import { useAuth } from '../../hooks/useAuth'

const roleBadgeColor: Record<string, string> = {
  admin:     'bg-black text-white',
  evaluator: 'bg-indigo text-white',
  viewer:    'bg-neutral text-gray-600',
}

export function Header() {
  const { user } = useAuth()

  return (
    <header
      className="fixed top-0 left-64 right-0 h-20 z-40 flex items-center justify-between px-8"
      style={{ background: 'rgba(252,252,252,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F3F4F6' }}
    >
      <div />
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleBadgeColor[user.role]}`}>
          {user.role}
        </span>
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
      </div>
    </header>
  )
}
