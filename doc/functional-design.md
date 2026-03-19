# Evaluation Platform — Functional Design Document

> A video generation model evaluation platform supporting multi-model side-by-side comparison, subjective preference voting, objective score management, and experiment result analytics.

---

## Design Previews

| **Page** | **Preview Link** | **Description** |
| --- | --- | --- |
| Evaluation Interface (Pick Best) | [Preview](https://p.superdesign.dev/draft/95285bc4-ca76-4f84-9aa8-6bdc5c306e4a) | Core evaluation page — dual video comparison + voting + annotation |
| Login Page | [Preview](https://p.superdesign.dev/draft/dff73375-cb42-4a49-af3d-46e7257a4b6d) | Authentication page |
| Dashboard Overview | [Preview](https://p.superdesign.dev/draft/9ff2afe2-b244-4505-b96a-f1d356df7d6b) | Overview dashboard with stat cards + recent experiments + activity feed |
| Benchmark Management | [Preview](https://p.superdesign.dev/draft/a0c3a2e5-6d44-4807-95f3-97ef74846123) | Benchmark CRUD + data browsing |
| Model Management | [Preview](https://p.superdesign.dev/draft/be1dde24-9cfa-4d8d-b2e6-be4e5e7ab038) | Model registration + versioning + result upload |
| Experiment Results | [Preview](https://p.superdesign.dev/draft/107ce652-5488-4ca6-b493-5db5f2a96e64) | Experiment statistics + objective score comparison + per-sample details |
| Objective Scores | [Preview](https://p.superdesign.dev/draft/091aea6d-b86e-4348-9cb3-57c77d9fbca1) | Objective metric management + API integration + upload history |

**Full Canvas**: [SuperDesign Project](https://app.superdesign.dev/teams/ce762c7c-e5f0-40e5-ae6b-3835e3bc00ac/projects/614bdbe0-ebc1-4444-804f-d1f9896871f2)

---

## Core Concepts

### Benchmark

A collection of 10+ input samples, each consisting of **text prompt + reference image + reference video (optional)**.

- Supports naming and version updates (e.g. `Portrait-50 v2.0`)
- Each sample has an auto-incrementing ID; addressable via `{benchmark_id}_{sample_id}` (e.g. `portrait50_012`)
- One-click bulk download of all input data
- Full CRUD operations via web UI

### Model

A registered video generation model with version and type metadata.

- Model types include: AvatarIV, Tokyo, Custom, etc.
- Results on a given benchmark can be uploaded via web UI or API
- Version history tracking

### Experiment

A single evaluation session that selects multiple registered models + one benchmark for comparison.

- Evaluators compare model outputs sample by sample
- Pick the best result (Pick Best)
- Optionally explain the preference reason
- Tag issues on each video (e.g. lip sync off, artifacts)
- If the evaluator previously annotated the same sample in another experiment, historical annotations are displayed

### Objective Scores

Automated quality metrics uploaded through a unified API.

- Metrics include: Lip Sync, Clarity, Naturalness, Motion Quality, Identity Preservation, Audio-Visual Sync, etc.
- Unified API specification for all metrics
- Per-model and per-sample comparison views

---

## Page-by-Page Functional Specification

## 1. Login & Authentication

### Scenario

Internal evaluators sign in via email and password. Admins manage roles and permissions.

### Features

- **Login**: Email + password authentication
- **Roles**: Admin, Evaluator, Viewer
- **Permission Matrix**:

| **Permission** | **Admin** | **Evaluator** | **Viewer** |
| --- | --- | --- | --- |
| CRUD Benchmarks | ✓ | ✗ | ✗ |
| CRUD Models | ✓ | ✗ | ✗ |
| Create / Manage Experiments | ✓ | ✗ | ✗ |
| Participate in Evaluation (vote / annotate) | ✓ | ✓ | ✗ |
| View Experiment Results & Statistics | ✓ | ✓ | ✓ |
| Upload Objective Scores | ✓ | ✗ | ✗ |
| Account Registration / Management | ✓ | ✗ | ✗ |

---

## 2. Dashboard

### Scenario

The landing page after login. Provides a quick overview of platform activity.

### Features

- **Stat Cards** (4-column grid): Active Experiments, Total Models, Benchmarks, Evaluations This Week — each with trend percentage badge
- **Recent Experiments Table**: Experiment name, associated Benchmark, compared models, status (Active / Completed), progress bar, creation date
- **Activity Feed** (right panel): Real-time log of recent actions, e.g. "John voted on sample portrait50_012", "Admin uploaded Tokyo v3.1 results"

---

## 3. Benchmark Management

### Scenario

Admins create and maintain evaluation datasets. Evaluators and Viewers can browse.

### Features

- **List View**: Card-based layout (2-column grid), each card shows name, version, sample count, image thumbnails preview
- **Search & Filter**: Search by name, filter by version, sort options
- **Create Benchmark**: Set name, version, bulk upload samples (text + image + video)
- **Detail / Expanded View**: Browse samples individually — Sample ID, text prompt, reference image thumbnail, reference video indicator
- **Bulk Download**: One-click download of all input data as a zip package
- **Version Management**: Same benchmark can be updated to a new version (e.g. v1.0 → v2.0)

### Data Structure

```
Benchmark:
  - benchmark_id: string (unique identifier)
  - name: string
  - version: string
  - samples: [
      {
        sample_id: int (auto-increment),
        text_prompt: string,
        ref_image: file (required),
        ref_video: file (optional)
      }
    ]
```

---

## 4. Model Management

### Scenario

Admins register models and upload generation results. Evaluators can view model info.

### Features

- **Model List Table**: Model name, type (AvatarIV / Tokyo / Custom — color-coded badges), version, benchmarks tested count, results uploaded count, last updated, actions
- **Register Model**: Enter model name, type, version
- **Model Detail Panel** (right side):
    - Version history timeline (v2.1 → v2.0 → v1.5)
    - Benchmark result upload status (green checkmark = uploaded)
- **Upload Results**:
    - Web UI: Select model + benchmark, upload generated video files
    - API: Standard endpoint with code snippet display

### API Specification

```
POST /api/v1/models/{model_id}/results
Content-Type: multipart/form-data

{
  "benchmark_id": "portrait50",
  "version": "v2.0",
  "results": [
    { "sample_id": 1, "video": <file> },
    { "sample_id": 2, "video": <file> }
  ]
}
```

---

## 5. Evaluation Interface (Core Page)

### Scenario

Evaluators compare video outputs from multiple models sample by sample within an experiment, pick the best result, and annotate issues.

### Features

#### Top Navigation Bar

- Experiment name (e.g. "AvatarIV v2.1 vs Tokyo v3.0")
- Associated benchmark name
- Progress indicator (e.g. "12/50 samples completed")
- Previous / Next arrows to navigate between samples

#### Sample Info Card

- Sample ID (e.g. `portrait50_012`)
- Full text prompt display
- Reference image thumbnail
- Reference video thumbnail (if available)

#### Video Comparison Area (Hero Section)

- Two side-by-side video players (equal width), each inside a white rounded card
- Model labels shown as "Model A" / "Model B" (real names hidden to reduce bias)
- 16:9 video player with play / pause / seek controls
- Below each video:
    - **"Pick as Best" button** — turns indigo with checkmark when selected
    - **Comment textarea** — write specific feedback about this video
    - **Historical comments** — if previously evaluated, shown in a gray card with timestamp

#### Right Panel

- **Pick Reason**: After selecting a preference, text area "Why did you pick this one?" with suggested tags (Better lip sync / More natural / Clearer / Better motion)
- **Issue Tags**: Taggable per video — Lip sync off, Unnatural movement, Blurry, Artifacts, Identity drift, Audio mismatch
- **Previous Annotations**: If the evaluator annotated this sample in another experiment, shown in a collapsible card

#### Bottom Actions

- "Submit & Next" — primary button, submits vote and advances to next sample
- "Skip" — secondary button, skips current sample

---

## 6. Experiment Management & Results

### Scenario

Admins create experiments. All users can view results and statistics.

### Create Experiment

- Select participating models (multi-select)
- Select benchmark
- Set experiment name
- Assign evaluators

### Results Overview

- **Win Rate Stat Cards**: Model A win rate 62%, Model B win rate 31%, Tie/Skip 7%
- **Stacked Bar Chart**: Visual distribution of votes (Indigo / Emerald / Gray)

### Objective Score Comparison

- **Comparison Table**: Rows = metrics (Lip Sync, Clarity, Naturalness, Motion Quality, Identity Preservation), Columns = models
- Displays mean ± standard deviation
- Green highlight for better scores, orange for worse

### Per-Sample Detail

- **Detail Table**: Sample ID, voted winner (model name or Tie), voter, vote reason (truncated), mini bar charts for each objective score, expand button
- **Expanded View**:
    - Both video thumbnails
    - Full voter comment
    - Issue tag details
    - Objective scores as a radar chart

### Evaluator Leaderboard

- Sidebar showing how many samples each evaluator has completed

---

## 7. Objective Scores Management

### Scenario

Admins register objective evaluation metrics and upload scores through a unified API.

### Features

#### Metric Registration

- **Metric Card Grid** (3 columns): Lip Sync Score, Clarity Score, Naturalness Score, Motion Quality, Identity Preservation, Audio-Visual Sync
- Each card displays: metric name, icon, description, value range (0–1 or 0–100), status (Active / Inactive)
- Support for adding custom metrics

#### API Integration

Unified API specification with code block display:

```
POST /api/v1/scores/upload

{
  "model_id": "avatariv_v2.1",
  "benchmark_id": "portrait50_v2",
  "metric_name": "lip_sync",
  "scores": [
    { "sample_id": 1, "score": 0.87 },
    { "sample_id": 2, "score": 0.92 }
  ]
}

Response:
{
  "status": "success",
  "records_created": 2
}
```

#### Upload History

- Table showing: Metric name, Model, Benchmark, Sample count, Uploaded by, Date, Status (Success / Failed / Processing)

#### Quick Stats (Right Panel)

- Total registered metrics
- Total score records
- Last upload timestamp

---

## Design Specification

### Color Palette

| **Token** | **Value** | **Usage** |
| --- | --- | --- |
| Primary | `#000000` | Primary buttons, key actions |
| Background | `#FCFCFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Neutral | `#F3F4F6` | Secondary backgrounds |
| Gray Text | `#9CA3AF` | Secondary text, labels |
| Indigo | `#6366F1` | Accent, charts, selected states |
| Emerald | `#10B981` | Success, positive metrics |
| Orange | `#FB923C` | Warnings, attention |

### Typography

- **Headers**: General Sans (semi-bold, tracking-tight)
- **Body / UI**: Satoshi

### Layout

- Fixed 256px glassmorphism sidebar
- 80px sticky header with backdrop blur
- Main content area on a 12-column grid
- Card border-radius: 32px, shadow: `0 4px 20px -4px rgba(0,0,0,0.03)`
- Buttons: fully rounded, hover transition 300ms ease-in-out, click scale(0.95)
