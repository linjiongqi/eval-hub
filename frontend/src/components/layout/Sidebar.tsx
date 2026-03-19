import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',        icon: 'lucide:layout-dashboard' },
  { to: '/experiments', label: 'Experiments',       icon: 'lucide:flask-conical' },
  { to: '/benchmarks',  label: 'Benchmarks',        icon: 'lucide:database' },
  { to: '/models',      label: 'Models',            icon: 'lucide:cpu' },
  { to: '/scores',      label: 'Objective Scores',  icon: 'lucide:bar-chart-2' },
]

export function Sidebar() {
  const { isAdmin } = useAuth()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 z-50 flex flex-col"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRight: '1px solid #F3F4F6' }}>
      
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">E</span>
        </div>
        <span className="font-heading font-bold text-base tracking-tight">EvalHub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-neutral hover:text-black'
              }`
            }
          >
            <Icon icon={item.icon} className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {/* Users — Admin only */}
        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-neutral hover:text-black'
              }`
            }
          >
            <Icon icon="lucide:users" className="w-4 h-4 flex-shrink-0" />
            User Management
          </NavLink>
        )}
      </nav>

      {/* Bottom user info */}
      <div className="px-4 py-4 border-t border-neutral">
        <UserInfo />
      </div>
    </aside>
  )
}

function UserInfo() {
  const { user } = useAuth()
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-text capitalize">{user.role}</p>
      </div>
    </div>
  )
}
