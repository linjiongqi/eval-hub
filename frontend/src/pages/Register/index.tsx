import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mockInvitations } from '../../data/mock-data'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  const invitation = mockInvitations.find(inv => inv.token === token && !inv.accepted_at)

  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface rounded-card shadow-card p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-lg font-heading font-semibold mb-2">Invalid or expired link</h1>
          <p className="text-sm text-gray-text mb-6">
            This invitation link is invalid or has already been used.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-black text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      // Mock: mark invitation as accepted and navigate
      invitation!.accepted_at = new Date().toISOString()
      navigate('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">EvalHub</span>
        </div>

        <div className="bg-surface rounded-card shadow-card p-8">
          <h1 className="text-xl font-heading font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-gray-text mb-6">You've been invited to join EvalHub</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={invitation.email}
                readOnly
                className="w-full border border-neutral rounded-xl px-3 py-2 text-sm bg-neutral text-gray-text cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95] disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-gray-text mt-4 text-center">
            Role: <span className="font-medium text-gray-700 capitalize">{invitation.role}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
