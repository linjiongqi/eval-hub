import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { UserInvitation } from '../../types'

interface Props {
  onClose: () => void
  onInvite: (inv: UserInvitation) => void
}

export function InviteUserModal({ onClose, onInvite }: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState<'evaluator' | 'viewer'>('evaluator')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const inv: UserInvitation = {
      id:          `inv-${Date.now()}`,
      email:       email.trim(),
      role,
      invited_by:  'Admin User',
      token:       `token-${Date.now()}`,
      expires_at:  new Date(Date.now() + 7 * 86400000).toISOString(),
      accepted_at: null,
      created_at:  new Date().toISOString(),
    }
    onInvite(inv)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between">
          <h2 className="font-heading font-semibold">Invite User</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="freelancer@example.com" required
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
            <select
              value={role} onChange={e => setRole(e.target.value as 'evaluator' | 'viewer')}
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="evaluator">Evaluator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <p className="text-xs text-gray-text">
            An invitation link will be sent to this email. Valid for 7 days.
          </p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-neutral rounded-full py-2 text-sm font-medium hover:bg-neutral transition-all duration-300">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-black text-white rounded-full py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]">
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
