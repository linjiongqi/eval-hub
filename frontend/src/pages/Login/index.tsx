import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { mockUsers, mockPasswords } from '../../data/mock-data'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleOkta() {
    // Mock: instantly log in as admin
    navigate('/dashboard')
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email)
      const validPassword = mockPasswords[email]

      if (!user || validPassword !== password) {
        setError('Invalid email or password.')
        setLoading(false)
        return
      }

      // In real app: set auth token. For mock, just navigate.
      navigate('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">EvalHub</span>
        </div>

        <div className="bg-surface rounded-card shadow-card p-8">
          <h1 className="text-xl font-heading font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-gray-text mb-6">Internal evaluation platform</p>

          {/* Okta SSO */}
          <button
            onClick={handleOkta}
            className="w-full flex items-center justify-center gap-2 border border-neutral rounded-full py-2.5 text-sm font-medium hover:bg-neutral transition-all duration-300 active:scale-[0.95] mb-4"
          >
            <Icon icon="mdi:shield-account" className="w-4 h-4" />
            Sign in with Okta
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-neutral" />
            <span className="text-xs text-gray-text">or</span>
            <div className="flex-1 h-px bg-neutral" />
          </div>

          {/* Email + Password */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@eval.com"
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Mock credentials hint */}
          <div className="mt-5 p-3 bg-neutral rounded-xl text-xs text-gray-text">
            <p className="font-medium text-gray-700 mb-1">Mock credentials</p>
            <p>admin@eval.com / admin123</p>
            <p>eval@eval.com / eval123</p>
            <p>view@eval.com / view123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
