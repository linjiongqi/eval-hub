import type {
  User, Benchmark, Model, ModelResult, Experiment,
  Vote, VoteVideoFeedback, ObjectiveScore, Metric,
  ActivityLog, UserInvitation, ScoreUploadLog,
} from '../types'

// ─── Current User (change to switch roles) ───────────────────────────────────
export const CURRENT_USER_ID = 'user-1'

// ─── Users ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { user_id: 'user-1', name: 'Admin User',  email: 'admin@eval.com', role: 'admin',     auth_type: 'password', is_active: true },
  { user_id: 'user-2', name: 'Eval User',   email: 'eval@eval.com',  role: 'evaluator', auth_type: 'password', is_active: true },
  { user_id: 'user-3', name: 'View User',   email: 'view@eval.com',  role: 'viewer',    auth_type: 'password', is_active: true },
  { user_id: 'user-4', name: 'Jane Smith',  email: 'jane@eval.com',  role: 'evaluator', auth_type: 'okta',     is_active: true },
  { user_id: 'user-5', name: 'Bob Lee',     email: 'bob@eval.com',   role: 'evaluator', auth_type: 'okta',     is_active: false },
]

export const mockPasswords: Record<string, string> = {
  'admin@eval.com': 'admin123',
  'eval@eval.com':  'eval123',
  'view@eval.com':  'view123',
}

// ─── Benchmarks ───────────────────────────────────────────────────────────────
export const mockBenchmarks: Benchmark[] = [
  {
    benchmark_id: 'portrait50',
    name: 'Portrait-50',
    version: 'v2.0',
    sample_count: 5,
    status: 'current',
    created_at: '2026-01-10T08:00:00Z',
    samples: [
      { sample_id: 1, text_prompt: 'A woman speaking naturally in front of a white background, smiling warmly at the camera.', ref_image: 'https://picsum.photos/seed/p1/400/400', ref_video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { sample_id: 2, text_prompt: 'A man giving a business presentation, gesturing confidently with both hands.', ref_image: 'https://picsum.photos/seed/p2/400/400' },
      { sample_id: 3, text_prompt: 'A young person laughing and talking on the phone in a casual setting.', ref_image: 'https://picsum.photos/seed/p3/400/400', ref_video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { sample_id: 4, text_prompt: 'An elderly woman telling a story, with expressive facial movements.', ref_image: 'https://picsum.photos/seed/p4/400/400' },
      { sample_id: 5, text_prompt: 'A professional anchor reading news in a studio environment, looking directly at camera.', ref_image: 'https://picsum.photos/seed/p5/400/400' },
    ],
  },
  {
    benchmark_id: 'speaking50',
    name: 'Speaking-50',
    version: 'v1.0',
    sample_count: 5,
    status: 'production',
    created_at: '2025-11-05T10:00:00Z',
    samples: [
      { sample_id: 1, text_prompt: 'A teacher explaining a math concept on a whiteboard.', ref_image: 'https://picsum.photos/seed/s1/400/400' },
      { sample_id: 2, text_prompt: 'A politician giving a speech at a podium, speaking passionately.', ref_image: 'https://picsum.photos/seed/s2/400/400' },
      { sample_id: 3, text_prompt: 'A comedian performing stand-up, laughing with the audience.', ref_image: 'https://picsum.photos/seed/s3/400/400' },
      { sample_id: 4, text_prompt: 'A doctor explaining a diagnosis to a patient calmly.', ref_image: 'https://picsum.photos/seed/s4/400/400' },
      { sample_id: 5, text_prompt: 'A tour guide describing landmarks with enthusiasm.', ref_image: 'https://picsum.photos/seed/s5/400/400' },
    ],
  },
  {
    benchmark_id: 'action20',
    name: 'Action-20',
    version: 'v1.5',
    sample_count: 5,
    status: 'legacy',
    created_at: '2025-08-20T14:00:00Z',
    samples: [
      { sample_id: 1, text_prompt: 'A dancer performing a waltz in a grand ballroom.', ref_image: 'https://picsum.photos/seed/a1/400/400' },
      { sample_id: 2, text_prompt: 'An athlete warming up before a race, stretching.', ref_image: 'https://picsum.photos/seed/a2/400/400' },
      { sample_id: 3, text_prompt: 'A chef chopping vegetables quickly and precisely.', ref_image: 'https://picsum.photos/seed/a3/400/400' },
      { sample_id: 4, text_prompt: 'A martial artist performing a kata sequence.', ref_image: 'https://picsum.photos/seed/a4/400/400' },
      { sample_id: 5, text_prompt: 'A painter working on a large canvas with broad strokes.', ref_image: 'https://picsum.photos/seed/a5/400/400' },
    ],
  },
]

// ─── Models ───────────────────────────────────────────────────────────────────
export const mockModels: Model[] = [
  {
    model_id: 'avatariv',
    name: 'AvatarIV',
    type: 'AvatarIV',
    version: 'v2.1',
    benchmarks_tested: 2,
    results_uploaded: 10,
    updated_at: '2026-03-10T09:00:00Z',
    version_history: [
      { version: 'v2.1', uploaded_at: '2026-03-10T09:00:00Z', benchmark_ids: ['portrait50', 'speaking50'] },
      { version: 'v2.0', uploaded_at: '2026-01-20T11:00:00Z', benchmark_ids: ['portrait50'] },
      { version: 'v1.5', uploaded_at: '2025-11-01T08:00:00Z', benchmark_ids: ['portrait50'] },
    ],
  },
  {
    model_id: 'tokyo',
    name: 'Tokyo',
    type: 'Tokyo',
    version: 'v3.0',
    benchmarks_tested: 1,
    results_uploaded: 5,
    updated_at: '2026-03-08T14:00:00Z',
    version_history: [
      { version: 'v3.0', uploaded_at: '2026-03-08T14:00:00Z', benchmark_ids: ['portrait50'] },
      { version: 'v2.5', uploaded_at: '2026-01-15T10:00:00Z', benchmark_ids: ['portrait50'] },
    ],
  },
  {
    model_id: 'custom-v1',
    name: 'CustomModel',
    type: 'Custom',
    version: 'v1.0',
    benchmarks_tested: 0,
    results_uploaded: 0,
    updated_at: '2026-03-01T12:00:00Z',
    version_history: [
      { version: 'v1.0', uploaded_at: '2026-03-01T12:00:00Z', benchmark_ids: [] },
    ],
  },
]

// ─── Model Results ─────────────────────────────────────────────────────────────
export const mockModelResults: ModelResult[] = [
  ...[1,2,3,4,5].map(i => ({ model_id: 'avatariv', benchmark_id: 'portrait50', sample_id: i, version: 'v2.1', video_path: 'https://www.w3schools.com/html/mov_bbb.mp4' })),
  ...[1,2,3,4,5].map(i => ({ model_id: 'tokyo',    benchmark_id: 'portrait50', sample_id: i, version: 'v3.0', video_path: 'https://www.w3schools.com/html/movie.mp4' })),
]

// ─── Experiments ──────────────────────────────────────────────────────────────
export const mockExperiments: Experiment[] = [
  {
    experiment_id: 'exp-1',
    name: 'AvatarIV v2.1 vs Tokyo v3.0',
    benchmark_id: 'portrait50',
    benchmark_name: 'Portrait-50',
    model_ids: ['avatariv', 'tokyo'],
    model_names: ['AvatarIV', 'Tokyo'],
    display_labels: ['Model A', 'Model B'],
    evaluator_ids: ['user-2'],
    status: 'active',
    progress: { completed: 3, total: 5 },
    created_at: '2026-03-15T09:00:00Z',
  },
  {
    experiment_id: 'exp-2',
    name: 'AvatarIV vs Tokyo Final',
    benchmark_id: 'portrait50',
    benchmark_name: 'Portrait-50',
    model_ids: ['avatariv', 'tokyo'],
    model_names: ['AvatarIV', 'Tokyo'],
    display_labels: ['Model A', 'Model B'],
    evaluator_ids: ['user-1', 'user-2', 'user-4', 'user-3'],
    status: 'completed',
    progress: { completed: 5, total: 5 },
    created_at: '2026-03-01T10:00:00Z',
  },
]

// ─── Votes (20 on exp-2: 4 evaluators × 5 samples) ──────────────────────────
const voteData: Array<{ evaluator_id: string; sample_id: number; winner: string | null; is_tie: boolean; is_skipped: boolean; reason: string }> = [
  { evaluator_id: 'user-1', sample_id: 1, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Better lip sync overall' },
  { evaluator_id: 'user-1', sample_id: 2, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'More natural movement' },
  { evaluator_id: 'user-1', sample_id: 3, winner: 'tokyo',    is_tie: false, is_skipped: false, reason: 'Clearer facial details' },
  { evaluator_id: 'user-1', sample_id: 4, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Better audio sync' },
  { evaluator_id: 'user-1', sample_id: 5, winner: null,       is_tie: true,  is_skipped: false, reason: '' },
  { evaluator_id: 'user-2', sample_id: 1, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'More natural expressions' },
  { evaluator_id: 'user-2', sample_id: 2, winner: 'tokyo',    is_tie: false, is_skipped: false, reason: 'Better motion quality' },
  { evaluator_id: 'user-2', sample_id: 3, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Superior lip sync' },
  { evaluator_id: 'user-2', sample_id: 4, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Better identity preservation' },
  { evaluator_id: 'user-2', sample_id: 5, winner: 'tokyo',    is_tie: false, is_skipped: false, reason: 'Clearer output' },
  { evaluator_id: 'user-4', sample_id: 1, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Preferred overall quality' },
  { evaluator_id: 'user-4', sample_id: 2, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Natural head movement' },
  { evaluator_id: 'user-4', sample_id: 3, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Better background handling' },
  { evaluator_id: 'user-4', sample_id: 4, winner: null,       is_tie: false, is_skipped: true,  reason: '' },
  { evaluator_id: 'user-4', sample_id: 5, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Much clearer audio sync' },
  { evaluator_id: 'user-3', sample_id: 1, winner: 'tokyo',    is_tie: false, is_skipped: false, reason: 'Better clarity' },
  { evaluator_id: 'user-3', sample_id: 2, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'More realistic' },
  { evaluator_id: 'user-3', sample_id: 3, winner: null,       is_tie: true,  is_skipped: false, reason: '' },
  { evaluator_id: 'user-3', sample_id: 4, winner: 'avatariv', is_tie: false, is_skipped: false, reason: 'Strong lip sync' },
  { evaluator_id: 'user-3', sample_id: 5, winner: 'tokyo',    is_tie: false, is_skipped: false, reason: 'Better motion' },
]

export const mockVotes: Vote[] = voteData.map((v, i) => ({
  vote_id: `vote-exp2-${i + 1}`,
  experiment_id: 'exp-2',
  sample_id: v.sample_id,
  evaluator_id: v.evaluator_id,
  winner_model_id: v.winner,
  is_tie: v.is_tie,
  is_skipped: v.is_skipped,
  pick_reason: v.reason || undefined,
  created_at: `2026-03-0${Math.min(v.sample_id + 1, 9)}T${10 + i % 8}:00:00Z`,
}))

// Historical votes on exp-1 (for cross-experiment annotation demo)
export const mockHistoricalVotes: Vote[] = [
  { vote_id: 'hist-1', experiment_id: 'exp-1', sample_id: 1, evaluator_id: 'user-2', winner_model_id: 'avatariv', is_tie: false, is_skipped: false, pick_reason: 'Looked more natural in previous test', created_at: '2026-03-16T10:00:00Z' },
  { vote_id: 'hist-2', experiment_id: 'exp-1', sample_id: 2, evaluator_id: 'user-2', winner_model_id: 'tokyo',    is_tie: false, is_skipped: false, pick_reason: 'Tokyo had better motion here', created_at: '2026-03-16T10:05:00Z' },
  { vote_id: 'hist-3', experiment_id: 'exp-1', sample_id: 3, evaluator_id: 'user-2', winner_model_id: null,       is_tie: true,  is_skipped: false, pick_reason: undefined, created_at: '2026-03-16T10:10:00Z' },
]

// ─── Vote Feedback ─────────────────────────────────────────────────────────────
export const mockVoteVideoFeedback: VoteVideoFeedback[] = [
  { vote_id: 'vote-exp2-1',  model_id: 'avatariv', comment: 'Very natural lip movement', issue_tags: [] },
  { vote_id: 'vote-exp2-1',  model_id: 'tokyo',    comment: 'Slight lag in lip sync',    issue_tags: ['lip_sync_off'] },
  { vote_id: 'vote-exp2-3',  model_id: 'avatariv', comment: 'Good overall',              issue_tags: [] },
  { vote_id: 'vote-exp2-3',  model_id: 'tokyo',    comment: 'Clearer details here',      issue_tags: [] },
  { vote_id: 'vote-exp2-6',  model_id: 'avatariv', comment: 'Excellent expressions',     issue_tags: [] },
  { vote_id: 'vote-exp2-6',  model_id: 'tokyo',    comment: 'Some artifacts visible',    issue_tags: ['artifacts', 'blurry'] },
  { vote_id: 'vote-exp2-11', model_id: 'avatariv', comment: 'Strong performance',        issue_tags: [] },
  { vote_id: 'vote-exp2-11', model_id: 'tokyo',    comment: 'Identity drift noticeable', issue_tags: ['identity_drift'] },
]

// ─── Objective Scores ─────────────────────────────────────────────────────────
const metricNames = ['lip_sync', 'clarity', 'naturalness', 'motion_quality', 'identity_preservation', 'av_correlation']
const avatarScores: Record<string, number[]> = {
  lip_sync:               [0.87, 0.84, 0.91, 0.88, 0.85],
  clarity:                [0.78, 0.81, 0.76, 0.80, 0.79],
  naturalness:            [0.82, 0.85, 0.83, 0.87, 0.84],
  motion_quality:         [0.79, 0.82, 0.80, 0.83, 0.81],
  identity_preservation:  [0.90, 0.88, 0.91, 0.89, 0.92],
  av_correlation:         [0.85, 0.83, 0.86, 0.84, 0.87],
}
const tokyoScores: Record<string, number[]> = {
  lip_sync:               [0.75, 0.78, 0.74, 0.77, 0.76],
  clarity:                [0.88, 0.90, 0.87, 0.91, 0.89],
  naturalness:            [0.76, 0.78, 0.75, 0.79, 0.77],
  motion_quality:         [0.85, 0.87, 0.84, 0.88, 0.86],
  identity_preservation:  [0.80, 0.82, 0.79, 0.83, 0.81],
  av_correlation:         [0.78, 0.80, 0.77, 0.81, 0.79],
}

export const mockObjectiveScores: ObjectiveScore[] = [
  ...metricNames.flatMap(m =>
    [1,2,3,4,5].map(i => ({ model_id: 'avatariv', benchmark_id: 'portrait50', metric_name: m, sample_id: i, score: avatarScores[m][i-1] }))
  ),
  ...metricNames.flatMap(m =>
    [1,2,3,4,5].map(i => ({ model_id: 'tokyo', benchmark_id: 'portrait50', metric_name: m, sample_id: i, score: tokyoScores[m][i-1] }))
  ),
]

// ─── Metrics ──────────────────────────────────────────────────────────────────
export const mockMetrics: Metric[] = [
  { metric_id: 'm-1', metric_name: 'lip_sync',              name: 'Lip Sync Score',          description: 'Measures alignment between audio and lip movement', range: { min: 0, max: 1 }, status: 'active',   icon: 'mdi:microphone' },
  { metric_id: 'm-2', metric_name: 'clarity',               name: 'Clarity Score',           description: 'Visual sharpness and resolution quality',           range: { min: 0, max: 1 }, status: 'active',   icon: 'mdi:eye' },
  { metric_id: 'm-3', metric_name: 'naturalness',           name: 'Naturalness Score',       description: 'How natural the generated video appears',           range: { min: 0, max: 1 }, status: 'active',   icon: 'mdi:human' },
  { metric_id: 'm-4', metric_name: 'motion_quality',        name: 'Motion Quality',          description: 'Smoothness and realism of motion',                  range: { min: 0, max: 1 }, status: 'active',   icon: 'mdi:run' },
  { metric_id: 'm-5', metric_name: 'identity_preservation', name: 'Identity Preservation',  description: 'How well identity is preserved from reference image', range: { min: 0, max: 1 }, status: 'active',   icon: 'mdi:face-recognition' },
  { metric_id: 'm-6', metric_name: 'av_correlation',        name: 'AV Correlation',          description: 'Audio-visual synchronization correlation',           range: { min: 0, max: 1 }, status: 'inactive', icon: 'mdi:waveform' },
]

// ─── Activity Logs ────────────────────────────────────────────────────────────
export const mockActivityLogs: ActivityLog[] = [
  { id: 'log-1',  user_id: 'user-2', user_name: 'Eval User',   action: 'voted on',              entity: 'portrait50_003', created_at: '2026-03-18T14:30:00Z' },
  { id: 'log-2',  user_id: 'user-1', user_name: 'Admin User',  action: 'uploaded results for',  entity: 'AvatarIV v2.1',  created_at: '2026-03-18T13:00:00Z' },
  { id: 'log-3',  user_id: 'user-4', user_name: 'Jane Smith',  action: 'voted on',              entity: 'portrait50_005', created_at: '2026-03-18T11:45:00Z' },
  { id: 'log-4',  user_id: 'user-1', user_name: 'Admin User',  action: 'created experiment',    entity: 'AvatarIV vs Tokyo Final', created_at: '2026-03-17T09:00:00Z' },
  { id: 'log-5',  user_id: 'user-2', user_name: 'Eval User',   action: 'voted on',              entity: 'portrait50_002', created_at: '2026-03-17T16:20:00Z' },
  { id: 'log-6',  user_id: 'user-3', user_name: 'View User',   action: 'voted on',              entity: 'portrait50_001', created_at: '2026-03-17T15:10:00Z' },
  { id: 'log-7',  user_id: 'user-1', user_name: 'Admin User',  action: 'uploaded results for',  entity: 'Tokyo v3.0',     created_at: '2026-03-16T10:00:00Z' },
  { id: 'log-8',  user_id: 'user-4', user_name: 'Jane Smith',  action: 'voted on',              entity: 'portrait50_004', created_at: '2026-03-16T14:00:00Z' },
  { id: 'log-9',  user_id: 'user-1', user_name: 'Admin User',  action: 'registered model',      entity: 'CustomModel v1.0', created_at: '2026-03-15T11:00:00Z' },
  { id: 'log-10', user_id: 'user-2', user_name: 'Eval User',   action: 'voted on',              entity: 'portrait50_001', created_at: '2026-03-15T13:30:00Z' },
]

// ─── Score Upload Logs ────────────────────────────────────────────────────────
export const mockScoreUploadLogs: ScoreUploadLog[] = [
  { id: 'sul-1', model_id: 'avatariv', model_name: 'AvatarIV', benchmark_id: 'portrait50', benchmark_name: 'Portrait-50', metric_name: 'lip_sync',              sample_count: 5, status: 'success',    uploaded_at: '2026-03-10T09:10:00Z', uploaded_by: 'Admin User' },
  { id: 'sul-2', model_id: 'avatariv', model_name: 'AvatarIV', benchmark_id: 'portrait50', benchmark_name: 'Portrait-50', metric_name: 'clarity',               sample_count: 5, status: 'success',    uploaded_at: '2026-03-10T09:12:00Z', uploaded_by: 'Admin User' },
  { id: 'sul-3', model_id: 'tokyo',    model_name: 'Tokyo',    benchmark_id: 'portrait50', benchmark_name: 'Portrait-50', metric_name: 'lip_sync',              sample_count: 5, status: 'success',    uploaded_at: '2026-03-08T14:20:00Z', uploaded_by: 'Admin User' },
  { id: 'sul-4', model_id: 'tokyo',    model_name: 'Tokyo',    benchmark_id: 'portrait50', benchmark_name: 'Portrait-50', metric_name: 'motion_quality',        sample_count: 5, status: 'failed',     error_msg: 'Invalid score range: value 1.23 exceeds max 1.0', uploaded_at: '2026-03-08T14:25:00Z', uploaded_by: 'Admin User' },
  { id: 'sul-5', model_id: 'avatariv', model_name: 'AvatarIV', benchmark_id: 'portrait50', benchmark_name: 'Portrait-50', metric_name: 'identity_preservation', sample_count: 5, status: 'processing', uploaded_at: '2026-03-18T14:00:00Z', uploaded_by: 'Admin User' },
]

// ─── Invitations ──────────────────────────────────────────────────────────────
export const mockInvitations: UserInvitation[] = [
  { id: 'inv-1', email: 'freelancer@example.com', role: 'evaluator', invited_by: 'Admin User', token: 'test-token', expires_at: '2026-03-25T00:00:00Z', accepted_at: null,                  created_at: '2026-03-18T10:00:00Z' },
  { id: 'inv-2', email: 'accepted@example.com',   role: 'evaluator', invited_by: 'Admin User', token: 'used-token', expires_at: '2026-03-22T00:00:00Z', accepted_at: '2026-03-17T09:00:00Z', created_at: '2026-03-15T10:00:00Z' },
]

// ─── Dashboard Trend Values (hardcoded mock) ──────────────────────────────────
export const dashboardStats = {
  activeExperiments: { value: 1,  trend: '+33%',  positive: true  },
  totalModels:       { value: 3,  trend: '+50%',  positive: true  },
  benchmarks:        { value: 3,  trend: '0%',    positive: null  },
  weeklyEvaluations: { value: 20, trend: '+15%',  positive: true  },
}
