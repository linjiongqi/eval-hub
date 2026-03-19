# EvalHub Frontend Implementation Spec

**Date:** 2026-03-18
**Scope:** Frontend only (mock data stage)
**Reference:** `doc/design.md`, `doc/functional-design-zh.md`

---

## Overview

Build the EvalHub frontend as a Vite + React 18 + TypeScript SPA. All data is mocked during this phase. Pages are built one at a time in dependency order. Shared components are created when first needed and reused by subsequent pages.

---

## Project Structure

```
Eval/
├── frontend/
│   ├── public/fonts/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── types/index.ts
│   │   ├── data/mock-data.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── AppLayout.tsx
│   │   │   ├── ui/
│   │   │   │   ├── StatCard.tsx       ← Task 3
│   │   │   │   ├── Badge.tsx          ← Task 3
│   │   │   │   ├── ProgressBar.tsx    ← Task 3
│   │   │   │   ├── VideoPlayer.tsx    ← Task 7 (shared, lives here)
│   │   │   │   ├── RadarChart.tsx     ← Task 8
│   │   │   │   └── MiniBarChart.tsx   ← Task 8
│   │   │   └── shared/
│   │   │       ├── IssueTagSelector.tsx  ← Task 7 (shared, lives here)
│   │   │       └── PermissionGuard.tsx   ← Task 1
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Benchmarks/
│   │   │   ├── Models/
│   │   │   ├── Experiments/
│   │   │   ├── Evaluation/
│   │   │   ├── Results/
│   │   │   ├── Scores/
│   │   │   └── Users/              ← Task 10
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useExperiment.ts
│   │   └── utils/
│   │       ├── permissions.ts
│   │       └── formatSampleId.ts   ← Task 1
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
└── doc/
```

> **Note on component placement:** `VideoPlayer`, `RadarChart`, `MiniBarChart`, and `IssueTagSelector` are created in Tasks 7–8 but placed directly in `components/ui/` or `components/shared/` — never inside a page folder — so they are reusable from day one.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS |
| Routing | react-router-dom v6 |
| Icons | @iconify/react (lucide set) |
| Charts | recharts (stacked bar, radar) |
| Fonts | General Sans, Satoshi, JetBrains Mono |
| Data | mock-data.ts |

---

## Design System (Tailwind Config)

### Colors
```js
colors: {
  primary:    '#000000',
  background: '#FCFCFC',
  surface:    '#FFFFFF',
  neutral:    '#F3F4F6',
  'gray-text':'#9CA3AF',
  indigo:     '#6366F1',
  emerald:    '#10B981',
  orange:     '#FB923C',
}
```

### Layout Tokens
- Sidebar: `w-64` (256px), glassmorphism (`backdrop-blur-md bg-white/80`)
- Header: `h-20` (80px), sticky, backdrop blur
- Card: `rounded-[32px]`, `shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]`
- Button: `rounded-full`, hover `scale-[1.01]`, active `scale-[0.95]`, `transition-all duration-300`

---

## Routes

| Route | Page | Guard |
|-------|------|-------|
| `/login` | Login | Public |
| `/register` | Register | Public (valid token) |
| `/dashboard` | Dashboard | Authenticated |
| `/benchmarks` | Benchmarks | Authenticated |
| `/models` | Models | Authenticated |
| `/experiments` | Experiment List | Authenticated |
| `/experiments/:id` | Evaluation | Admin / Evaluator only |
| `/experiments/:id/results` | Results | Authenticated |
| `/scores` | Scores | Authenticated |
| `/users` | User Management | Admin only |

---

## TypeScript Types (`types/index.ts`)

All status fields use **lowercase** to match the DB schema.

```typescript
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
  sample_id: number          // integer, e.g. 12
  text_prompt: string
  ref_image: string          // URL
  ref_video?: string         // URL, optional
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

// Video path for a model's generated output on a specific sample
export interface ModelResult {
  model_id: string
  benchmark_id: string
  sample_id: number
  version: string
  video_path: string         // URL served from NFS
}

export interface Experiment {
  experiment_id: string
  name: string
  benchmark_id: string
  benchmark_name: string
  model_ids: string[]
  model_names: string[]
  display_labels: string[]   // e.g. ['Model A', 'Model B'] — always use this in VideoPlayer, never model_names
  evaluator_ids: string[]
  status: 'active' | 'completed'   // lowercase
  progress: { completed: number; total: number }
  created_at: string
}

export interface Vote {
  vote_id: string
  experiment_id: string
  sample_id: number
  evaluator_id: string
  winner_model_id: string | null  // null = tie or skip (matches DB NULL)
  is_tie: boolean
  is_skipped: boolean
  pick_reason?: string
  created_at: string
}

// Per-video annotation — maps to vote_video_feedback table
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

// Display labels for issue tags (used in IssueTagSelector chips and Results expanded view)
export const ISSUE_TAG_LABELS: Record<IssueTag, string> = {
  lip_sync_off:       'Lip sync off',
  unnatural_movement: 'Unnatural movement',
  blurry:             'Blurry',
  artifacts:          'Artifacts',
  identity_drift:     'Identity drift',
  audio_mismatch:     'Audio mismatch',
}

// Quick-tag chip labels for pick reason (display only)
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
  metric_name: string        // slug, e.g. "lip_sync"
  name: string               // display name
  description: string
  range: { min: number; max: number }
  status: 'active' | 'inactive'   // lowercase
  icon: string
}

export interface User {
  user_id: string
  name: string
  email: string
  role: 'admin' | 'evaluator' | 'viewer'
  auth_type: 'okta' | 'password'
  is_active: boolean         // false = deactivated (soft delete)
}

// Feed display formula: `${user_name} ${action} ${entity}`
// e.g. "Alice voted on portrait50_012" or "Admin uploaded results for AvatarIV v2.1"
export interface ActivityLog {
  id: string
  user_id: string
  user_name: string          // denormalized for display
  action: string             // present-tense phrase, e.g. 'voted on', 'uploaded results for', 'created experiment'
  entity: string             // target display string, e.g. 'portrait50_012', 'AvatarIV v2.1'
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
```

---

## Utility: `formatSampleId`

```typescript
// utils/formatSampleId.ts
// Formats a benchmark_id + sample_id into the display address
// e.g. formatSampleId('portrait50', 12) → 'portrait50_012'
export function formatSampleId(benchmarkId: string, sampleId: number): string {
  return `${benchmarkId}_${String(sampleId).padStart(3, '0')}`
}
```

---

## Permission Helpers (`utils/permissions.ts`)

```typescript
type Role = 'admin' | 'evaluator' | 'viewer'

export const canEdit   = (role: Role) => role === 'admin'
export const canVote   = (role: Role) => role === 'admin' || role === 'evaluator'
export const canUpload = (role: Role) => role === 'admin'
export const canManageUsers = (role: Role) => role === 'admin'
```

---

## Task Breakdown

### Task 1 — Project Setup + Design System + AppLayout + Mock Data

**Deliverables:**
- `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Tailwind configured with full design token set (colors, border-radius, shadows, transition)
- Font files loaded: General Sans (headings), Satoshi (body), JetBrains Mono (code)
- `types/index.ts` — all interfaces as defined in the Types section above
- `utils/formatSampleId.ts` — as defined above
- `utils/permissions.ts` — as defined above
- `data/mock-data.ts` — see Mock Data section below
- `AppLayout.tsx` — wraps all authenticated routes with Sidebar + Header
- `Sidebar.tsx` — 256px glassmorphism, nav links with active highlight per route; **Users link visible only when `isAdmin === true`** (hidden for Evaluator and Viewer)
- `Header.tsx` — 80px sticky, shows current user name + role badge
- `App.tsx` — full route config; `/login` and `/register` render without AppLayout; all others wrapped
- `useAuth.ts` — returns mock current user from `mock-data.ts`; exposes `user`, `role`, `isAdmin`, `isEvaluator`, `isViewer`
- `PermissionGuard.tsx` — accepts `roles: Role[]` prop, renders children only if current user role is in list; otherwise renders nothing

**Success criteria:** `npm run dev` starts without errors. All routes are accessible. Sidebar shows correct active link. Admin/Evaluator/Viewer roles can be switched by changing `currentUserId` in `mock-data.ts`.

---

### Task 2 — Login + Register Pages

**Deliverables:**
- `pages/Login/index.tsx`
  - "Sign in with Okta" button: mock action → set current user to admin → redirect `/dashboard`
  - Email + Password form: validate against mock users; show error on mismatch; redirect `/dashboard` on success
- `pages/Register/index.tsx`
  - Reads `?token=` from URL query param
  - Pre-fills email from mock invitation (read-only)
  - Name input + Password input
  - Submit: mock creates user → redirect `/dashboard`

**Success criteria:** All three mock users can log in. Register page loads with `?token=test-token` and shows pre-filled email.

---

### Task 3 — Dashboard

**New components:** `StatCard`, `Badge`, `ProgressBar`

**Deliverables:**
- `components/ui/StatCard.tsx` — value, label, trend % badge (green up arrow if positive, red down if negative); trend values are **hardcoded in Dashboard** mock data (not computed), e.g.:
  - Active Experiments: 2, trend: `+33%` (green)
  - Total Models: 3, trend: `+50%` (green)
  - Benchmarks: 3, trend: `0%` (gray)
  - Weekly Evaluations: 20, trend: `+15%` (green)
- `components/ui/Badge.tsx` — pill badge; variant prop controls color (`indigo | emerald | orange | gray`)
- `components/ui/ProgressBar.tsx` — thin bar, percentage fill, color prop
- `pages/Dashboard/index.tsx` — 4-column stat grid + main table + right feed
- `pages/Dashboard/RecentExperiments.tsx` — table: name, benchmark, model badges, status badge, progress bar, date
- `pages/Dashboard/ActivityFeed.tsx` — scrollable list; each entry: initials avatar, action text (`formatSampleId` used here), relative timestamp

**Success criteria:** 4 stat cards show correct mock counts. Experiments table renders. Activity feed shows 10 entries.

---

### Task 4 — Benchmark Management

**New components:** `BenchmarkCard`, `BenchmarkDetail`

**Deliverables:**
- `pages/Benchmarks/index.tsx` — 2-col card grid; search input filters by name; version dropdown filters; sort by name / sample count / date
- `pages/Benchmarks/BenchmarkCard.tsx` — name, version badge, status badge (`current/production/legacy`), sample count, 3 image thumbnails (mock URLs)
- `pages/Benchmarks/BenchmarkDetail.tsx` — slide-in panel: sample list rows with `formatSampleId()`, prompt text (truncated), image thumbnail, video indicator icon
- Admin only (via `PermissionGuard`):
  - **Create Benchmark modal** — fields: name (text input), version (text input, default "v1.0"), bulk sample upload area (mock: accept files, display file names); Submit adds to mock list
  - **Edit button** on card — same modal pre-filled; version field allows update (e.g. v1.0 → v2.0), triggering a version log entry in mock data
  - **Delete button** on card — confirmation dialog before removal
- Bulk Download button: mock shows browser `alert('Download started')`

**Success criteria:** Cards render. Detail panel opens. Admin sees Create/Edit/Delete; Evaluator/Viewer do not.

---

### Task 5 — Model Management

**New components:** `ModelDetailPanel`, `UploadResultsModal`

**Deliverables:**
- `pages/Models/index.tsx` — table columns: name, type badge (AvatarIV=indigo, Tokyo=emerald, Custom=orange), version, benchmarks tested, results uploaded, last updated, actions
- `pages/Models/ModelDetailPanel.tsx` — right-side slide panel; version history timeline (chronological list with version + date); per-benchmark upload status grid (green checkmark = results exist, gray dash = missing)
- `pages/Models/UploadResultsModal.tsx` — modal: benchmark dropdown, drag-and-drop file area (mock), API code snippet block in JetBrains Mono
- Admin only:
  - **Register Model modal** — fields: model name (text input), type (dropdown: AvatarIV / Tokyo / Custom), version (text input, e.g. "v2.1"); Submit adds to mock model list and writes first version_history entry
  - **Upload Results** button per row — opens `UploadResultsModal`
  - **Delete** per row — confirmation dialog

**Success criteria:** Table type badges have correct colors. Row click opens detail panel. Admin sees action buttons. Upload modal opens with API snippet.

---

### Task 6 — Experiment List + Create

**New components:** `CreateExperimentModal`

**Deliverables:**
- `pages/Experiments/index.tsx` — table: experiment name, benchmark name, model badges, status badge, progress bar, created date; "Open" button (→ evaluation), "Results" button (→ results)
- `pages/Experiments/CreateExperimentModal.tsx` — modal:
  - Experiment name input
  - Benchmark single-select dropdown
  - Model multi-select checkboxes; selected models auto-assigned "Model A", "Model B", etc. in selection order
  - Evaluator multi-select checkboxes
  - Submit: adds to mock experiment list → redirect to `/experiments/:id`
- Admin only: "Create Experiment" button

**Success criteria:** Experiment list renders. Admin sees Create button. Modal opens, form submits, new experiment appears in list.

---

### Task 7 — Evaluation Interface

**New components:** `VideoPlayer`, `SampleInfoCard`, `VideoCompareArea`, `AnnotationPanel`, `IssueTagSelector`

**Deliverables:**
- `pages/Evaluation/index.tsx` — top nav: experiment name, benchmark name, progress "12/50", ← → arrows; bottom bar: "Submit & Next" (primary), "Skip" (secondary)
- `pages/Evaluation/SampleInfoCard.tsx` — displays `formatSampleId(benchmarkId, sample.sample_id)`, full prompt text, ref image thumbnail, ref video thumbnail (if present)
- `components/ui/VideoPlayer.tsx` — 16:9 aspect-ratio wrapper; play/pause/seek scrubber; model label chip top-left; accepts `src` and `label` props. **Always pass `experiment.display_labels[i]` as label — never `experiment.model_names[i]`** to avoid leaking real model identity to evaluators
- `pages/Evaluation/VideoCompareArea.tsx` — two `VideoPlayer` side by side; below each: "Pick as Best" button (default: black outline; selected: indigo fill + checkmark icon); comment `<textarea>`; historical comments section (gray card with timestamp, shown if prior votes exist for this sample in this experiment)
- `pages/Evaluation/AnnotationPanel.tsx` — right panel:
  - Pick reason `<textarea>` (enabled after a pick is made)
  - Quick-tag chip row: "Better lip sync", "More natural", "Clearer", "Better motion" — chips toggle on click, append to pick_reason
  - Issue tag selectors: one `IssueTagSelector` per video (labeled "Model A Issues" / "Model B Issues")
  - Historical annotations section: collapsible card, shows prior annotations where **evaluator_id = current user AND benchmark_id + sample_id match AND experiment_id ≠ current experiment** — only the current evaluator's own annotations from other experiments (sourced from mock data)
- `components/shared/IssueTagSelector.tsx` — chip group; all 6 issue tags; multi-select toggle; accepts `value: IssueTag[]` and `onChange` props
- `hooks/useExperiment.ts` — manages: `currentSampleIndex`, `votes: Record<number, Vote>`, `feedback: Record<string, VoteVideoFeedback>`, `navigate(direction: 'prev'|'next')`, `submitVote()`, `skip()`

**Success criteria:** Page loads with first mock sample. Both videos render (mock URLs). Picking a model highlights it indigo. Issue tags toggle. Submit advances sample index. Skip also advances. Historical annotations show for samples that have prior mock votes.

---

### Task 8 — Experiment Results

**New components:** `WinRateCards`, `ObjectiveScoreTable`, `SampleDetailTable`, `RadarChart`, `MiniBarChart`, `EvaluatorLeaderboard`

**Deliverables:**
- `pages/Results/index.tsx` — two-column layout: main content left, evaluator leaderboard right sidebar
- `pages/Results/WinRateCards.tsx` — 3 stat cards: Model A win %, Model B win %, **Tie/Skip %** (tie and skip votes combined); below: horizontal stacked bar chart (recharts `BarChart`) in indigo / emerald / gray
- `pages/Results/ObjectiveScoreTable.tsx` — rows = **5 metrics** (Lip Sync, Clarity, Naturalness, Motion Quality, Identity Preservation — AV Correlation excluded per functional-design), cols = 2 models; cell = "mean ± std"; best value cell: green bg; worst: orange bg
- `pages/Results/SampleDetailTable.tsx` — rows per sample: `formatSampleId()`, **winner real model name** (use `model_names`, not `display_labels` — results page reveals real identity), voter name, pick reason (truncated 60 chars), per-metric `MiniBarChart`, expand chevron; expanded row: video thumbnails side-by-side, full comment, issue tag pills, `RadarChart`
- `components/ui/MiniBarChart.tsx` — inline `<svg>` bar, width prop, value 0–1 fills proportionally, color matches metric
- `components/ui/RadarChart.tsx` — recharts `RadarChart` with 6 axes (one per metric), two data series (one per model), legend
- `pages/Results/EvaluatorLeaderboard.tsx` — right sidebar list; each entry: evaluator name, completed sample count, mini progress bar

**Success criteria:** Win rate cards show correct mock percentages. Objective score table highlights best/worst cells. Per-sample rows expand. Radar chart renders with two model lines.

---

### Task 9 — Objective Scores Management

**New components:** `MetricCard`, `UploadHistory`, `QuickStats`

**Deliverables:**
- `pages/Scores/index.tsx` — 3-col metric grid (left 2/3) + quick stats panel (right 1/3); API code block below grid
- `pages/Scores/MetricCard.tsx` — icon, display name, description, value range badge (e.g. "0 – 1"), status toggle chip (`active` = emerald, `inactive` = gray); Admin only: Edit + Delete icon buttons
- Admin only: **"Add Metric" button** above the grid — modal with fields: metric_name (slug), display name, description, range min/max; Submit adds to mock metrics list
- `pages/Scores/UploadHistory.tsx` — table: metric name, model name, benchmark name, sample count, uploaded by, date, status badge (`success` = emerald, `failed` = orange, `processing` = indigo)
- `pages/Scores/QuickStats.tsx` — 3 stats: total registered metrics count, total score records count, last upload timestamp
- API code block: syntax-highlighted `POST /api/v1/scores/upload` example in JetBrains Mono, copy button

**Success criteria:** 6 metric cards in 3-col grid. Upload history table has mock rows. Quick stats show correct counts.

---

### Task 10 — User Management

**New components:** `InviteUserModal`

**Deliverables:**
- `pages/Users/index.tsx` — table: name, email, role badge, auth type badge (`okta` / `password`), status (active/inactive), last active; Admin only access (redirect non-admins to `/dashboard`)
- `pages/Users/InviteUserModal.tsx` — modal: email input, role dropdown (`evaluator` / `viewer`), Submit → mock adds pending invitation; shows invitation list below user table with status (pending / accepted / expired) and expiry date
- Admin actions per row: change role dropdown, deactivate toggle

**Success criteria:** User list renders. Admin can open invite modal. Invitation appears in pending list. Non-admin visiting `/users` is redirected to `/dashboard`.

---

## Mock Data (`data/mock-data.ts`)

### Users (3)
```
admin@eval.com   / admin123 / role: admin    / auth_type: password
eval@eval.com    / eval123  / role: evaluator / auth_type: password
view@eval.com    / view123  / role: viewer    / auth_type: password
```

### Benchmarks (3)
- `portrait50` v2.0, status: current, **5 samples** with mock image URLs
- `speaking50` v1.0, status: production, 5 samples
- `action20` v1.5, status: legacy, 5 samples

> **Note on sample count:** 5 samples per benchmark is sufficient for mock stage. All experiment progress numbers are set to match (see below).

### Models (3)
- AvatarIV, type: AvatarIV, version: v2.1, 3-entry version history
- Tokyo, type: Tokyo, version: v3.0, 2-entry version history
- CustomModel, type: Custom, version: v1.0, 1-entry version history
- `ModelResult` entries: both AvatarIV and Tokyo have results for `portrait50` (5 samples each), using placeholder video URLs

### Experiments (2)
- "AvatarIV v2.1 vs Tokyo v3.0" — benchmark: portrait50, models: [AvatarIV, Tokyo], display_labels: ['Model A', 'Model B'], evaluators: [eval user], status: active, progress: **3/5** (3 of 5 samples voted)
- "AvatarIV vs Tokyo Final" — benchmark: portrait50, models: [AvatarIV, Tokyo], display_labels: ['Model A', 'Model B'], evaluators: [eval user], status: completed, progress: **5/5**

> Progress total = benchmark sample count (5). Experiment 2 has 20 total Vote records = 4 evaluators × 5 samples each, making win-rate stats meaningful.

### Votes (20, all on completed experiment)
- 20 `Vote` records for experiment 2 (samples 1–20)
- Distribution: AvatarIV wins 13, Tokyo wins 5, tie 2 (≈65% / 25% / 10%)
- Each vote has 2 `VoteVideoFeedback` entries (one per model) with comment and 0–2 issue tags

### Historical annotations (for Task 7 demo)
- 3 votes from experiment 1 on samples 1–3, referencing same benchmark `portrait50` — these appear as "historical annotations" in the evaluation page

### Objective Scores
- 6 metrics × 2 models (AvatarIV + Tokyo) × 5 samples = 60 `ObjectiveScore` records
- AvatarIV scores slightly higher on lip_sync; Tokyo higher on clarity

### Activity Logs (10 entries)
- Mix of vote, upload_results, create_experiment actions with different users

### Metrics (6)
- lip_sync (0–1), clarity (0–1), naturalness (0–1), motion_quality (0–1), identity_preservation (0–1), av_correlation (0–1)

### Score Upload Logs (5)
- 3 success entries, 1 failed (with error_msg), 1 processing

### User Invitations (2)
- 1 pending (email: freelancer@example.com, expires 7 days from now)
- 1 accepted (email: accepted@example.com)

---

## Validation Checklist (from design.md Section 9)

- [ ] `npm run dev` runs with no errors, all routes accessible
- [ ] Login → redirects to Dashboard for all 3 mock users
- [ ] Sidebar links navigate correctly, active state highlights
- [ ] Dashboard stat cards display mock data
- [ ] Benchmark cards expand/collapse
- [ ] Model table type badges are color-correct (indigo/emerald/orange)
- [ ] Evaluation page: dual videos side by side, Pick Best toggles indigo, Issue Tags multi-selectable
- [ ] Results page: win rate cards, objective score table with highlights, row expand with radar chart
- [ ] Scores page: metric cards in 3-col grid, upload history table with status badges
- [ ] Viewer role: Create/Edit/Delete/Upload buttons hidden across all pages
- [ ] `/users` redirects non-admin to `/dashboard`
- [ ] Users page: user list renders with status column; invite modal submits and pending invitation appears in list; deactivate toggle and role change visible to admin only

---

## Out of Scope (This Phase)

- Backend / real API integration
- Real video file serving (placeholder URLs used)
- Real Okta OAuth flow (mocked as instant login)
- Real email invitation sending (mocked)
- Real file uploads (UI shown but no actual file processing)
