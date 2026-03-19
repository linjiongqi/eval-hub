import { useMemo } from 'react'
import { mockUsers, CURRENT_USER_ID } from '../data/mock-data'
import type { User } from '../types'

export function useAuth() {
  const user: User = useMemo(
    () => mockUsers.find(u => u.user_id === CURRENT_USER_ID) ?? mockUsers[0],
    []
  )

  return {
    user,
    role: user.role,
    isAdmin:     user.role === 'admin',
    isEvaluator: user.role === 'evaluator',
    isViewer:    user.role === 'viewer',
  }
}
