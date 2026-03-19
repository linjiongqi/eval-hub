// ─── Core Types ───────────────────────────────────────────────────────────────

export interface Benchmark {
  benchmark_id: string
  name: string
  version: string
  sample_count: number
  samples: Sample[]
  status: 'current' | 'production' | 'legacy'
  created_at: string
}

export interface Sample {
  sample_id: number
  text_prompt: string
  ref_image: string
  ref_video?: string
}

export interface Model {
  model_id: string
  name: string
  type: 'AvatarIV' | 'Tokyo' | 'Custom'
  version: string
  benchmarks_tested: number
  results_uploaded: number
  updated_at: string
  version_history: ModelVersion[]
}

export interface ModelVersion {
  version: string
  uploaded_at: string
  benchmark_ids: string[]
}

export interface ModelResult {
  model_id: string
  benchmark_id: string
  sample_id: number
  version: string
  video_path: string
}

export interface Experiment {
  experiment_id: string
  name: string
  benchmark_id: string
  benchmark_name: string
  model_ids: string[]
  model_names: string[]
  display_labels: string[]
  evaluator_ids: string[]
  status: 'active' | 'completed'
  progress: { completed: number; total: number }
  created_at: string
}

export interface Vote {
  vote_id: string
  experiment_id: string
  sample_id: number
  evaluator_id: string
  winner_model_id: string | null
  is_tie: boolean
  is_skipped: boolean
  pick_reason?: string
  created_at: string
}

export interface VoteVideoFeedback {
  vote_id: string
  model_id: string
  comment?: string
  issue_tags: IssueTag[]
}

export type IssueTag =
  | 'lip_sync_off'
  | 'unnatural_movement'
  | 'blurry'
  | 'artifacts'
  | 'identity_drift'
  | 'audio_mismatch'

export const ISSUE_TAG_LABELS: Record<IssueTag, string> = {
  lip_sync_off: 'Lip sync off',
  unnatural_movement: 'Unnatural movement',
  blurry: 'Blurry',
  artifacts: 'Artifacts',
  identity_drift: 'Identity drift',
  audio_mismatch: 'Audio mismatch',
}

export const PICK_REASON_TAGS = [
  'Better lip sync',
  'More natural',
  'Clearer',
  'Better motion',
] as const

export interface ObjectiveScore {
  model_id: string
  benchmark_id: string
  metric_name: string
  sample_id: number
  score: number
}

export interface Metric {
  metric_id: string
  metric_name: string
  name: string
  description: string
  range: { min: number; max: number }
  status: 'active' | 'inactive'
  icon: string
}

export interface User {
  user_id: string
  name: string
  email: string
  role: 'admin' | 'evaluator' | 'viewer'
  auth_type: 'okta' | 'password'
  is_active: boolean
}

export interface ActivityLog {
  id: string
  user_id: string
  user_name: string
  action: string
  entity: string
  created_at: string
}

export interface UserInvitation {
  id: string
  email: string
  role: 'admin' | 'evaluator' | 'viewer'
  invited_by: string
  expires_at: string
  accepted_at: string | null
  created_at: string
  token: string
}

export interface ScoreUploadLog {
  id: string
  model_id: string
  model_name: string
  benchmark_id: string
  benchmark_name: string
  metric_name: string
  sample_count: number
  status: 'success' | 'failed' | 'processing'
  error_msg?: string
  uploaded_at: string
  uploaded_by: string
}
