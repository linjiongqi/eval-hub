import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { User } from '../../types'

interface Props {
  roles: User['role'][]
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ roles, children, fallback = null }: Props) {
  const { role } = useAuth()
  if (!roles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}
