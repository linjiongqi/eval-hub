type Role = 'admin' | 'evaluator' | 'viewer'

export const canEdit        = (role: Role) => role === 'admin'
export const canVote        = (role: Role) => role === 'admin' || role === 'evaluator'
export const canUpload      = (role: Role) => role === 'admin'
export const canManageUsers = (role: Role) => role === 'admin'
