import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Badge } from '../../components/ui/Badge'
import { InviteUserModal } from './InviteUserModal'
import { useAuth } from '../../hooks/useAuth'
import { mockUsers, mockInvitations } from '../../data/mock-data'
import type { User, UserInvitation } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const roleBadge: Record<User['role'], 'black' | 'indigo' | 'gray'> = {
  admin:     'black',
  evaluator: 'indigo',
  viewer:    'gray',
}

export default function UsersPage() {
  const { isAdmin } = useAuth()
  const navigate    = useNavigate()

  // Redirect non-admins
  if (!isAdmin) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const [users, setUsers]             = useState(mockUsers)
  const [invitations, setInvitations] = useState(mockInvitations)
  const [showInvite, setShowInvite]   = useState(false)

  function handleToggleActive(userId: string) {
    setUsers(prev => prev.map(u =>
      u.user_id === userId ? { ...u, is_active: !u.is_active } : u
    ))
  }

  function handleRoleChange(userId: string, role: User['role']) {
    setUsers(prev => prev.map(u =>
      u.user_id === userId ? { ...u, role } : u
    ))
  }

  function handleInvite(inv: UserInvitation) {
    setInvitations(prev => [inv, ...prev])
    setShowInvite(false)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">User Management</h1>
          <p className="text-sm text-gray-text mt-1">{users.length} users</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
        >
          <Icon icon="lucide:mail-plus" className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Users table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral bg-neutral/50">
              {['Name', 'Email', 'Role', 'Auth', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-text first:pl-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {users.map(user => (
              <tr key={user.user_id} className="hover:bg-neutral/20 transition-colors">
                <td className="pl-6 pr-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-text">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.user_id, e.target.value as User['role'])}
                    className="text-xs border border-neutral rounded-lg px-2 py-1 bg-white outline-none cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.auth_type === 'okta' ? 'indigo' : 'gray'} className="capitalize">
                    {user.auth_type}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.is_active ? 'emerald' : 'gray'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(user.user_id)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                      user.is_active
                        ? 'border-red-200 text-red-400 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald hover:bg-emerald-50'
                    }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invitations */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral">
          <h2 className="text-sm font-semibold">Invitations</h2>
        </div>
        {invitations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-text">No invitations sent yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral bg-neutral/50">
                {['Email', 'Role', 'Invited By', 'Expires', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-text first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral">
              {invitations.map(inv => {
                const isExpired  = !inv.accepted_at && new Date(inv.expires_at) <= new Date()
                const isAccepted = !!inv.accepted_at
                const status     = isAccepted ? 'accepted' : isExpired ? 'expired' : 'pending'
                const variant    = status === 'accepted' ? 'emerald' : status === 'expired' ? 'gray' : 'indigo'

                return (
                  <tr key={inv.id} className="hover:bg-neutral/20 transition-colors">
                    <td className="pl-6 pr-4 py-3 font-medium">{inv.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleBadge[inv.role]} className="capitalize">{inv.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-text">{inv.invited_by}</td>
                    <td className="px-4 py-3 text-xs text-gray-text">{formatDate(inv.expires_at)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={variant} className="capitalize">{status}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showInvite && (
        <InviteUserModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </div>
  )
}
