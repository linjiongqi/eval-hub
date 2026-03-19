# EvalHub — Design Document

> 本文档是实现前的需求对齐文档，确认后作为开发依据。

---

## 0. 设计稿预览（SuperDesign）

| 页面 | 预览链接 |
|------|----------|
| 评测界面（Pick Best） | [预览](https://p.superdesign.dev/draft/95285bc4-ca76-4f84-9aa8-6bdc5c306e4a) |
| 登录页 | [预览](https://p.superdesign.dev/draft/dff73375-cb42-4a49-af3d-46e7257a4b6d) |
| 仪表盘概览 | [预览](https://p.superdesign.dev/draft/9ff2afe2-b244-4505-b96a-f1d356df7d6b) |
| Benchmark 管理 | [预览](https://p.superdesign.dev/draft/a0c3a2e5-6d44-4807-95f3-97ef74846123) |
| 模型管理 | [预览](https://p.superdesign.dev/draft/be1dde24-9cfa-4d8d-b2e6-be4e5e7ab038) |
| 实验结果 | [预览](https://p.superdesign.dev/draft/107ce652-5488-4ca6-b493-5db5f2a96e64) |
| 客观评分管理 | [预览](https://p.superdesign.dev/draft/091aea6d-b86e-4348-9cb3-57c77d9fbca1) |

**完整画布**：[SuperDesign 项目](https://app.superdesign.dev/teams/ce762c7c-e5f0-40e5-ae6b-3835e3bc00ac/projects/614bdbe0-ebc1-4444-804f-d1f9896871f2)

---

## 1. 项目概述

**EvalHub** 是一个面向 HeyGen 内部评估人员的视频生成模型评测平台，支持：
- 多模型并排主观评测（Pick Best）
- 客观评分管理（Objective Scores API）
- 实验结果统计与分析
- Benchmark / Model 数据管理

---

## 2. 前端项目结构

### 2.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Vite + React 18 + TypeScript |
| 样式 | Tailwind CSS（与设计稿完全匹配） |
| 路由 | react-router-dom v6 |
| 图标 | @iconify/react（lucide 图标集） |
| 字体 | General Sans（标题）、Satoshi（正文）、JetBrains Mono（代码） |
| 数据 | mock-data.ts（先 mock，后接真实 API） |

### 2.2 目录结构

```
eval-hub/
├── public/
│   └── fonts/                  # General Sans、Satoshi、JetBrains Mono 字体文件
├── src/
│   ├── main.tsx                # 入口文件
│   ├── App.tsx                 # 路由配置
│   ├── index.css               # 全局样式 / Tailwind 指令
│   │
│   ├── types/
│   │   └── index.ts            # 全局类型定义（Benchmark、Model、Experiment 等）
│   │
│   ├── data/
│   │   └── mock-data.ts        # Mock 数据（用户、实验、模型、样本、评分等）
│   │
│   ├── components/             # 可复用 UI 组件
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     # 256px 玻璃拟态侧边栏
│   │   │   ├── Header.tsx      # 80px sticky 顶部栏
│   │   │   └── AppLayout.tsx   # Sidebar + Header + 主内容区 wrapper
│   │   ├── ui/
│   │   │   ├── StatCard.tsx    # 统计卡片（含趋势 badge）
│   │   │   ├── Badge.tsx       # 通用徽章（类型、状态等）
│   │   │   ├── VideoPlayer.tsx # 16:9 视频播放器
│   │   │   ├── ProgressBar.tsx # 进度条
│   │   │   ├── RadarChart.tsx  # 雷达图（实验结果用）
│   │   │   └── MiniBarChart.tsx# 迷你条形图（per-sample 用）
│   │   └── shared/
│   │       ├── IssueTagSelector.tsx  # 问题标签选择器
│   │       └── PermissionGuard.tsx   # 权限控制包装组件
│   │
│   ├── pages/                  # 页面组件（与路由一一对应）
│   │   ├── Login/
│   │   │   └── index.tsx
│   │   ├── Register/
│   │   │   └── index.tsx       # Freelancer 注册页（读 token、填姓名密码）
│   │   ├── Experiments/
│   │   │   ├── index.tsx       # 实验列表
│   │   │   └── CreateExperimentModal.tsx  # 创建实验弹窗
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── RecentExperiments.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── Benchmarks/
│   │   │   ├── index.tsx       # 列表 + 搜索筛选
│   │   │   ├── BenchmarkCard.tsx
│   │   │   └── BenchmarkDetail.tsx  # 展开详情面板
│   │   ├── Models/
│   │   │   ├── index.tsx       # 模型列表表格
│   │   │   ├── ModelDetailPanel.tsx # 右侧详情面板
│   │   │   └── UploadResultsModal.tsx
│   │   ├── Evaluation/
│   │   │   ├── index.tsx       # 评测主界面
│   │   │   ├── SampleInfoCard.tsx
│   │   │   ├── VideoCompareArea.tsx
│   │   │   └── AnnotationPanel.tsx  # 右侧标注面板
│   │   ├── Results/
│   │   │   ├── index.tsx       # 实验结果概览
│   │   │   ├── WinRateCards.tsx
│   │   │   ├── ObjectiveScoreTable.tsx
│   │   │   ├── SampleDetailTable.tsx
│   │   │   └── EvaluatorLeaderboard.tsx
│   │   └── Scores/
│   │       ├── index.tsx       # 客观评分管理
│   │       ├── MetricCard.tsx
│   │       ├── UploadHistory.tsx
│   │       └── QuickStats.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts          # 当前用户 & 角色
│   │   └── useExperiment.ts    # 实验进度、投票状态
│   │
│   └── utils/
│       └── permissions.ts      # 角色权限判断工具函数
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 页面清单与路由

| 路由 | 页面 | 访问权限 |
|------|------|----------|
| `/login` | 登录 | 所有人 |
| `/register` | Freelancer 注册（邀请链接跳转） | 所有人（需有效 token） |
| `/dashboard` | 仪表盘概览 | Admin / Evaluator / Viewer |
| `/benchmarks` | Benchmark 管理 | Admin（增删改）/ 其他（只读） |
| `/models` | 模型管理 | Admin（增删改）/ 其他（只读） |
| `/experiments` | 实验列表 + 创建实验 | Admin（创建）/ 所有人（查看） |
| `/experiments/:id` | 评测界面 | Admin / Evaluator |
| `/experiments/:id/results` | 实验结果 | 所有人 |
| `/scores` | 客观评分管理 | Admin（上传）/ 其他（只读） |

---

## 4. 设计系统

### 4.1 色彩

| Token | 值 | 用途 |
|-------|-----|------|
| Primary | `#000000` | 主按钮、关键操作 |
| Background | `#FCFCFC` | 页面背景 |
| Surface | `#FFFFFF` | 卡片、面板 |
| Neutral | `#F3F4F6` | 次级背景 |
| Gray Text | `#9CA3AF` | 次级文字、标签 |
| Indigo | `#6366F1` | 强调色、图表、选中态 |
| Emerald | `#10B981` | 成功、正向指标 |
| Orange | `#FB923C` | 警告、注意 |

### 4.2 排版

- 标题：General Sans，semi-bold，tracking-tight
- 正文/UI：Satoshi
- 代码块：JetBrains Mono

### 4.3 布局规范

- 侧边栏：256px 固定宽，玻璃拟态（`backdrop-filter: blur(12px)`，`background: rgba(255,255,255,0.8)`）
- Header：80px 固定高，sticky，带 backdrop blur
- 主内容：12 列网格
- 卡片圆角：32px
- 卡片阴影：`0 4px 20px -4px rgba(0,0,0,0.03)`
- 按钮：`border-radius: 9999px`，hover `scale(1.01)`，click `scale(0.95)`，transition 300ms

---

## 5. 数据模型

```typescript
// types/index.ts

export interface Benchmark {
  benchmark_id: string
  name: string
  version: string
  sample_count: number
  samples: Sample[]
  created_at: string
  status: 'Current' | 'Production' | 'Legacy'
}

export interface Sample {
  sample_id: number
  text_prompt: string
  ref_image: string       // URL
  ref_video?: string      // URL，可选
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

export interface Experiment {
  experiment_id: string
  name: string
  benchmark_id: string
  benchmark_name: string
  model_ids: string[]
  model_names: string[]
  evaluator_ids: string[]
  status: 'Active' | 'Completed'
  progress: { completed: number; total: number }
  created_at: string
}

export interface Vote {
  vote_id: string
  experiment_id: string
  sample_id: number
  evaluator_id: string
  winner_model_id: string | 'tie'
  is_tie: boolean
  is_skipped: boolean
  pick_reason?: string
  created_at: string
}

// issue_tags 和 comment 挂在每个视频上，对应 DB vote_video_feedback 表
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

export interface ObjectiveScore {
  model_id: string
  benchmark_id: string
  metric_name: string
  sample_id: number
  score: number
}

export interface Metric {
  metric_id: string
  name: string
  description: string
  range: { min: number; max: number }
  status: 'Active' | 'Inactive'
  icon: string
}

export interface User {
  user_id: string
  name: string
  email: string
  role: 'Admin' | 'Evaluator' | 'Viewer'
}
```

---

## 6. 权限矩阵

| 功能 | Admin | Evaluator | Viewer |
|------|-------|-----------|--------|
| CRUD Benchmarks | ✓ | ✗ | ✗ |
| CRUD Models | ✓ | ✗ | ✗ |
| 创建/管理 Experiments | ✓ | ✗ | ✗ |
| 参与评测（投票/标注） | ✓ | ✓ | ✗ |
| 查看实验结果 | ✓ | ✓ | ✓ |
| 上传客观评分 | ✓ | ✗ | ✗ |
| 账号管理 | ✓ | ✗ | ✗ |

Mock 阶段预置测试用户：

| 邮箱 | 密码 | 角色 |
|------|------|------|
| `admin@eval.com` | `admin123` | Admin |
| `eval@eval.com` | `eval123` | Evaluator |
| `view@eval.com` | `view123` | Viewer |

---

## 7. 各页面功能规格

### 7.1 Login

两种登录方式共用同一个登录页：

- **Okta SSO**（内部员工）：点击 "Sign in with Okta" 按钮，跳转 Okta 授权页，回调后签发 JWT
- **Email + Password**（Freelancer）：填写邮箱和密码登录，账号由 Admin 通过邀请链接创建

**Freelancer 注册流程：**
1. Admin 在用户管理页填写 Freelancer 邮箱 → 系统发送邀请邮件
2. Freelancer 点击邮件中的链接（有效期 7 天）→ 跳转注册页
3. 注册页预填邮箱（不可修改），Freelancer 设置姓名和密码
4. 注册完成 → 自动登录，角色为 `Evaluator`

Mock 阶段预置测试用户：

| 邮箱 | 密码 | 角色 | 类型 |
|------|------|------|------|
| `admin@eval.com` | `admin123` | Admin | password |
| `eval@eval.com` | `eval123` | Evaluator | password |
| `view@eval.com` | `view123` | Viewer | password |

### 7.2 Dashboard
- 4 列 Stat Cards：Active Experiments / Total Models / Benchmarks / Weekly Evaluations（含趋势 badge）
- Recent Experiments 表格：实验名、Benchmark、模型列表、状态、进度条、日期
- Activity Feed（右侧）：操作日志流

### 7.3 Benchmark Management
- 2 列卡片列表，每卡显示：名称、版本 badge、样本数、缩略图预览
- 搜索框 + 版本筛选 + 排序
- 点击卡片展开详情：浏览所有 Sample（ID、文本、图片、视频）
- Admin：显示 Create / Edit / Delete 按钮
- Bulk Download 按钮（zip）

### 7.4 Model Management
- 表格：模型名、类型 badge（颜色编码）、版本、Benchmarks 数量、Results 数量、最后更新、操作
- 右侧详情面板：版本历史 timeline、Benchmark 结果上传状态
- Admin：显示 Register Model / Upload Results / Delete
- API 代码片段展示（上传接口）

### 7.5 Experiment List & Create
- **实验列表**：表格显示实验名、Benchmark、参与模型、状态（进行中/已完成）、进度条、创建时间
- **创建实验**（Admin）：
  - 填写实验名称
  - 选择 Benchmark（下拉）
  - 多选参与模型（系统自动分配 Model A / Model B 标签，按创建顺序）
  - 多选分配评测员
  - 提交后跳转至该实验的评测界面

### 7.6 Evaluation Interface（核心页面）
- 顶部：实验名、Benchmark 名、进度 "12/50"、上一个/下一个
- 左侧主区域：
  - Sample Info 卡（ID、文本 prompt、参考图/视频）
  - 双视频播放器并排（Model A / Model B，真实名称隐藏）
  - 每视频下方：Pick as Best 按钮 + 评论输入框 + 历史评论
- 右侧面板：
  - 选中原因文本框 + 快捷 tag（Better lip sync / More natural / Clearer / Better motion）
  - Issue Tags（每个视频可打：Lip sync off / Unnatural movement / Blurry / Artifacts / Identity drift / Audio mismatch）
  - 历史标注（可折叠）
- 底部操作：Submit & Next（主）/ Skip（次）

### 7.7 Experiment Results
- Win Rate 卡片：Model A 62% / Model B 31% / Tie 7%
- 堆叠水平条形图
- Objective Score 对比表格：指标行 × 模型列，含均值±标准差，更好的绿色高亮
- Per-Sample 详情表：Sample ID、胜者、投票人、理由（截断）、各指标 mini 条形图、展开按钮
- 展开后：双视频缩略图 + 完整评论 + 雷达图
- 右侧：Evaluator 完成数排行榜

### 7.8 Objective Scores Management
- 3 列 Metric 卡片：Lip Sync / Clarity / Naturalness / Motion Quality / Identity Preservation / AV Correlation
- 每卡：图标、名称、描述、数值范围、Active/Inactive 状态、Edit/Delete
- API 集成代码块（POST /api/v1/scores/upload）
- Upload History 表格：指标名、模型、Benchmark、样本数、上传人、日期、状态
- 右侧 Quick Stats：总指标数 / 总记录数 / 最后上传时间

---

## 8. 后端架构

### 8.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | FastAPI（Python） |
| 数据库 | PostgreSQL |
| ORM | SQLAlchemy |
| 数据校验 | Pydantic v2 |
| 认证 | JWT（python-jose + bcrypt） |
| 文件存储 | NFS / JuiceFS 挂载，软连接，数据库只存路径字符串 |
| 文件服务 | FastAPI `StaticFiles` 挂载 NFS 目录，前端直接访问 URL |

### 8.2 目录结构

```
backend/
├── main.py                  # FastAPI app 入口，挂载路由和静态文件
├── config.py                # 环境变量（DB URL、NFS 挂载路径等）
├── database.py              # SQLAlchemy engine + session
├── dependencies.py          # get_db、get_current_user 等公共依赖
├── models/                  # SQLAlchemy ORM 模型
│   ├── user.py
│   ├── benchmark.py
│   ├── sample.py
│   ├── model.py
│   ├── experiment.py
│   ├── vote.py
│   └── score.py
├── schemas/                 # Pydantic 请求/响应模型
│   ├── benchmark.py
│   ├── sample.py
│   └── ...
├── routers/                 # 路由模块（每个资源一个文件）
│   ├── auth.py
│   ├── invitations.py
│   ├── benchmarks.py
│   ├── models.py
│   ├── experiments.py
│   ├── votes.py
│   ├── scores.py
│   └── activity.py
└── utils/
    └── permissions.py       # 角色权限校验依赖
```

### 8.3 数据库 Schema — Benchmark

```sql
-- 基准集主表
-- benchmark_id 是业务 slug（稳定，用于寻址），id 是 UUID（用于外键关联）
CREATE TABLE benchmarks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark_id VARCHAR(64) UNIQUE NOT NULL,  -- e.g. "portrait50"
    name         VARCHAR(255) NOT NULL,         -- e.g. "Portrait-50"
    version      VARCHAR(32) NOT NULL DEFAULT 'v1.0',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    created_by   UUID REFERENCES users(id)
);

-- 版本变更日志（每次更新版本号时写入一条）
CREATE TABLE benchmark_version_log (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark_id UUID REFERENCES benchmarks(id) ON DELETE CASCADE,
    version      VARCHAR(32) NOT NULL,
    note         TEXT,
    changed_at   TIMESTAMPTZ DEFAULT NOW(),
    changed_by   UUID REFERENCES users(id)
);

-- 样本表
CREATE TABLE samples (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark_id   UUID REFERENCES benchmarks(id) ON DELETE CASCADE,
    sample_id     INTEGER NOT NULL,   -- benchmark 内自增，portrait50_012 中的 012
    text_prompt    TEXT NOT NULL,
    ref_image_path TEXT NOT NULL,      -- NFS/JuiceFS 上的路径
    ref_video_path TEXT,               -- 可为空
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (benchmark_id, sample_id)
);
```

**寻址规则**：`{benchmark.benchmark_id}_{sample.sample_id}` → 如 `portrait50_012`（sample_id 前端展示时补零至3位）

### 8.4 API 接口 — Benchmark

```
# 列表与 CRUD
GET    /api/v1/benchmarks                                     # 列表（支持 ?search=&version=&sort=）
POST   /api/v1/benchmarks                                     # 创建 [Admin]
GET    /api/v1/benchmarks/{benchmark_id}                      # 详情
PATCH  /api/v1/benchmarks/{benchmark_id}                      # 更新名称/版本 [Admin]
DELETE /api/v1/benchmarks/{benchmark_id}                      # 删除 [Admin]

# 样本管理
GET    /api/v1/benchmarks/{benchmark_id}/samples              # 样本列表
POST   /api/v1/benchmarks/{benchmark_id}/samples              # 批量上传样本（路径或文件）[Admin]
DELETE /api/v1/benchmarks/{benchmark_id}/samples/{sample_id} # 删除单个样本 [Admin]

# 批量下载
GET    /api/v1/benchmarks/{benchmark_id}/download             # 打包为 zip 流式返回
```

**批量下载实现**：FastAPI `StreamingResponse` + Python `zipfile`，遍历样本的 NFS 路径实时打包，无需先写临时文件。

### 8.5 数据库 Schema — Model

```sql
-- 模型主表
CREATE TABLE models (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id  VARCHAR(64) UNIQUE NOT NULL,  -- e.g. "avatariv"，业务 slug
    name      VARCHAR(255) NOT NULL,         -- e.g. "AvatarIV"
    type      VARCHAR(32) NOT NULL,          -- 'AvatarIV' | 'Tokyo' | 'Custom'
    version   VARCHAR(32) NOT NULL,          -- 当前版本，e.g. "v2.1"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- 版本历史表（每次注册新版本写入一条）
CREATE TABLE model_versions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id    UUID REFERENCES models(id) ON DELETE CASCADE,
    version     VARCHAR(32) NOT NULL,
    note        TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);

-- 模型生成结果表（每个样本对应一条视频路径）
CREATE TABLE model_results (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id     UUID REFERENCES models(id) ON DELETE CASCADE,
    benchmark_id UUID REFERENCES benchmarks(id) ON DELETE CASCADE,
    sample_id   INTEGER NOT NULL,   -- 对应 samples.sample_id
    version      VARCHAR(32) NOT NULL,  -- 是哪个版本跑出来的
    video_path   TEXT NOT NULL,      -- NFS/JuiceFS 上的路径
    uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by  UUID REFERENCES users(id),
    UNIQUE (model_id, benchmark_id, sample_id)  -- 同一模型同一样本只存一条
);
```

**三张表的关系：**
- `models` — 模型本身（名称、类型、当前版本）
- `model_versions` — 版本变更日志，用于前端展示版本历史 timeline
- `model_results` — 模型在某 benchmark 某样本上生成的视频路径，评测时从这里取视频

### 8.6 API 接口 — Model

```
# 模型 CRUD
GET    /api/v1/models                              # 列表
POST   /api/v1/models                              # 注册模型 [Admin]
GET    /api/v1/models/{model_id}                   # 详情（含版本历史，version_history 数组随响应返回）
PATCH  /api/v1/models/{model_id}                   # 更新名称/类型/版本 [Admin]
DELETE /api/v1/models/{model_id}                   # 删除 [Admin]

# 结果管理
POST   /api/v1/models/{model_id}/results           # 批量上传生成视频 [Admin]
GET    /api/v1/models/{model_id}/results           # 查询某 benchmark 的上传状态 ?benchmark_id=
```

**上传结果接口（完整规范）：**
```
POST /api/v1/models/{model_id}/results
Content-Type: multipart/form-data

{
  "benchmark_id": "portrait50",
  "version": "v2.1",
  "results": [
    { "sample_id": 1, "video": <file> },
    { "sample_id": 2, "video": <file> }
  ]
}

Response:
{
  "status": "success",
  "records_created": 2
}
```

### 8.7 数据库 Schema — Experiment

```sql
-- 实验主表
CREATE TABLE experiments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(255) NOT NULL,
    benchmark_id UUID REFERENCES benchmarks(id),
    status       VARCHAR(16) DEFAULT 'active',  -- 'active' | 'completed'
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    created_by   UUID REFERENCES users(id)
);

-- 实验 × 模型（多对多）
-- display_label 用于前端隐藏真实名称（Model A / Model B）
CREATE TABLE experiment_models (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    model_id      UUID REFERENCES models(id) ON DELETE CASCADE,
    display_label VARCHAR(16) NOT NULL,  -- e.g. 'Model A', 'Model B'
    UNIQUE (experiment_id, model_id)
);

-- 实验 × 评测员（多对多）
CREATE TABLE experiment_evaluators (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    evaluator_id  UUID REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (experiment_id, evaluator_id)
);

-- 投票主记录（每个评测员对每个样本投一次）
CREATE TABLE votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id   UUID REFERENCES experiments(id) ON DELETE CASCADE,
    sample_id      INTEGER NOT NULL,
    evaluator_id    UUID REFERENCES users(id),
    winner_model_id UUID REFERENCES models(id),  -- NULL 表示平局或跳过
    is_tie          BOOLEAN DEFAULT false,
    is_skipped      BOOLEAN DEFAULT false,
    pick_reason     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (experiment_id, sample_id, evaluator_id)
);

-- 每个视频的标注（评论 + 问题标签，每条记录 = 一次投票 × 一个模型）
CREATE TABLE vote_video_feedback (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_id    UUID REFERENCES votes(id) ON DELETE CASCADE,
    model_id   UUID REFERENCES models(id),
    comment    TEXT,
    issue_tags TEXT[],  -- e.g. ['lip_sync_off', 'blurry']
    UNIQUE (vote_id, model_id)
);
```

**5张表的关系：**
- `experiments` — 实验基本信息
- `experiment_models` — 记录本次实验包含哪些模型，以及前端展示用的 display_label（Model A / Model B）
- `experiment_evaluators` — 记录哪些评测员被分配到本次实验
- `votes` — 每个评测员对每个样本的投票结果（选谁赢 + 选择原因）
- `vote_video_feedback` — 每个视频的独立标注，支持跨实验统计 tag 分布

**选用5张表而非2张表的原因：** 实验结果页需要统计"各模型被打各 tag 的次数"，5张表可以直接 `GROUP BY`，2张表的 JSONB 方案查询复杂且性能差。

### 8.8 API 接口 — Experiment

```
# 实验 CRUD
GET    /api/v1/experiments                          # 列表
POST   /api/v1/experiments                          # 创建实验 [Admin]
GET    /api/v1/experiments/{experiment_id}          # 详情（含模型列表、进度）
PATCH  /api/v1/experiments/{experiment_id}          # 更新状态 [Admin]
DELETE /api/v1/experiments/{experiment_id}          # 删除 [Admin]

# 评测流程
GET    /api/v1/experiments/{experiment_id}/samples/{sample_id}  # 获取当前样本 + 两个视频
POST   /api/v1/experiments/{experiment_id}/votes                 # 提交投票
GET    /api/v1/experiments/{experiment_id}/votes/{sample_id}    # 查询当前实验该样本的投票记录

# 跨实验历史标注（评测界面右侧面板"历史标注"功能）
# 返回当前评测员在其他实验中对同一 benchmark+sample 的所有标注记录
GET    /api/v1/samples/history?benchmark_id={id}&sample_id={id}  # evaluator_id 从 JWT 取，不作为参数暴露

# 实验结果
GET    /api/v1/experiments/{experiment_id}/results               # 胜率统计 + 客观评分对比
GET    /api/v1/experiments/{experiment_id}/results/samples       # per-sample 详情列表
```

### 8.9 数据库 Schema — Objective Scores

```sql
-- 指标注册表（定义有哪些指标、范围、状态）
CREATE TABLE metrics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(64) UNIQUE NOT NULL,  -- e.g. "lip_sync"，与 API 字段对应
    name        VARCHAR(255) NOT NULL,         -- e.g. "Lip Sync Score"
    description TEXT,
    range_min   FLOAT NOT NULL DEFAULT 0,
    range_max   FLOAT NOT NULL DEFAULT 1,
    icon        VARCHAR(64),
    status      VARCHAR(16) DEFAULT 'active',  -- 'active' | 'inactive'
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    created_by  UUID REFERENCES users(id)
);

-- 评分数据表（某模型在某 benchmark 某样本上的得分）
-- metric_name 直接存字符串，不做外键约束，方便外部脚本直接调用 API
CREATE TABLE objective_scores (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id     UUID REFERENCES models(id) ON DELETE CASCADE,
    benchmark_id UUID REFERENCES benchmarks(id) ON DELETE CASCADE,
    metric_name  VARCHAR(64) NOT NULL,   -- 对应 metrics.metric_name
    sample_id   INTEGER NOT NULL,
    score        FLOAT NOT NULL,
    uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by  UUID REFERENCES users(id),
    UNIQUE (model_id, benchmark_id, metric_name, sample_id)
);

-- 上传历史表（每次批量上传写一条，记录状态）
CREATE TABLE score_upload_logs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id     UUID REFERENCES models(id),
    benchmark_id UUID REFERENCES benchmarks(id),
    metric_name  VARCHAR(64) NOT NULL,
    sample_count INTEGER NOT NULL,
    status       VARCHAR(16) DEFAULT 'processing',  -- 'success' | 'failed' | 'processing'
    error_msg    TEXT,        -- 失败时记录原因
    uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by  UUID REFERENCES users(id)
);
```

**三张表的关系：**
- `metrics` — 指标注册，定义平台支持哪些指标及其元信息
- `objective_scores` — 实际评分数据，`metric_name` 用字符串关联而非外键，外部脚本直接传名称即可
- `score_upload_logs` — 每批上传记录一条，UI 的 Upload History 表格直接读这张表

### 8.10 API 接口 — Objective Scores

```
# 指标管理
GET    /api/v1/metrics                      # 列表
POST   /api/v1/metrics                      # 注册新指标 [Admin]
PATCH  /api/v1/metrics/{metric_name}        # 更新描述/范围/状态 [Admin]
DELETE /api/v1/metrics/{metric_name}        # 删除 [Admin]

# 评分上传（供外部脚本调用）
POST   /api/v1/scores/upload                # 批量上传评分

# 评分查询
GET    /api/v1/scores                       # 查询评分 ?model_id=&benchmark_id=&metric_name=
GET    /api/v1/scores/upload-logs           # 上传历史列表
```

**上传接口完整规范：**
```
POST /api/v1/scores/upload

{
  "model_id": "avatariv",
  "benchmark_id": "portrait50",
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

### 8.11 数据库 Schema — Activity Log

```sql
-- 操作日志表（驱动 Dashboard 右侧动态日志）
CREATE TABLE activity_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID REFERENCES users(id),
    action     VARCHAR(64) NOT NULL,   -- 'vote', 'upload_results', 'create_experiment' 等
    entity     VARCHAR(32) NOT NULL,   -- 'vote', 'model_result', 'experiment' 等
    entity_id  UUID,                   -- 对应记录的 ID
    detail     JSONB,                  -- 附加信息，如 { sample_id: "portrait50_012" }
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

写入时机：用户每次投票、上传结果、创建实验时，由后端在同一事务内写入一条记录。Dashboard 查询时取最近 N 条，JOIN users 表拼接姓名展示。

```
GET /api/v1/activity-logs?limit=20    # Dashboard 动态日志，返回最近 N 条操作记录
```

### 8.12 数据库 Schema — User & Invitation

```sql
-- 用户主表
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    avatar_url    TEXT,                        -- Okta 头像 URL
    auth_type     VARCHAR(16) NOT NULL DEFAULT 'okta',  -- 'okta' | 'password'
    okta_id       VARCHAR(128) UNIQUE,         -- Okta sub，auth_type='okta' 时必填
    password_hash TEXT,                        -- bcrypt，auth_type='password' 时必填
    role          VARCHAR(16) NOT NULL DEFAULT 'evaluator',  -- 'admin' | 'evaluator' | 'viewer'
    is_active     BOOLEAN DEFAULT true,        -- 停用账号而非物理删除
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 邀请表（Admin 邀请 Freelancer 时创建）
CREATE TABLE user_invitations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL,
    token       VARCHAR(128) UNIQUE NOT NULL,  -- 安全随机 token，拼入邀请链接
    role        VARCHAR(16) NOT NULL DEFAULT 'evaluator',
    invited_by  UUID REFERENCES users(id),
    expires_at  TIMESTAMPTZ NOT NULL,          -- 创建时间 + 7 天
    accepted_at TIMESTAMPTZ,                   -- NULL 表示未使用，注册后写入时间戳
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**auth_type 说明：**
- `okta`：内部员工，通过 Okta SSO 登录，`okta_id` 必填，`password_hash` 为 NULL
- `password`：Freelancer，通过邀请链接注册，`password_hash` 必填，`okta_id` 为 NULL

### 8.13 API 接口 — Auth & User

```
# Okta SSO（内部员工）
GET    /api/v1/auth/okta/login           # 重定向至 Okta 授权页
GET    /api/v1/auth/okta/callback        # Okta 回调，换取用户信息并签发 JWT

# Email + Password（Freelancer）
POST   /api/v1/auth/login                # 邮箱 + 密码登录，返回 JWT

# 通用
POST   /api/v1/auth/logout               # 登出（客户端清除 token）
GET    /api/v1/auth/me                   # 获取当前用户信息

# 邀请流程 [Admin]
POST   /api/v1/invitations               # 发送邀请邮件（传入 email + role）
GET    /api/v1/invitations/{token}       # 验证 token 是否有效（注册页加载时调用）
POST   /api/v1/invitations/{token}/accept  # 提交注册信息（name + password），创建账号

# 用户管理 [Admin]
GET    /api/v1/users                     # 用户列表
PATCH  /api/v1/users/{user_id}           # 修改角色 / 名称
DELETE /api/v1/users/{user_id}           # 停用账号（is_active = false）
```

**Freelancer 登录规范：**
```
POST /api/v1/auth/login
{ "email": "freelancer@example.com", "password": "..." }

Response:
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user": { "user_id": "...", "name": "...", "role": "evaluator", "auth_type": "password" }
}
```

**邀请注册规范：**
```
# Step 1：Admin 发送邀请
POST /api/v1/invitations
{ "email": "freelancer@example.com", "role": "evaluator" }
→ 系统发送邮件，链接格式：https://eval.heygen.com/register?token=<token>

# Step 2：Freelancer 提交注册
POST /api/v1/invitations/{token}/accept
{ "name": "Zhang San", "password": "..." }
→ 创建 users 记录，写入 accepted_at，返回 JWT 自动登录
```

---

## 9. 验证清单

- [ ] `npm run dev` 无报错，所有路由可访问
- [ ] 登录 → 跳转 Dashboard
- [ ] 侧边栏所有链接跳转正确，激活高亮
- [ ] Dashboard stat cards 显示 mock 数据
- [ ] Benchmark 卡片展开/收起
- [ ] Model 表格类型 badge 颜色正确
- [ ] 评测页面：双视频并排，Pick Best 切换，Issue Tags 可选
- [ ] 结果页面：胜率卡片、对比表格、展开行
- [ ] 客观评分页面：指标卡片、上传历史
- [ ] Viewer 角色：不显示创建/编辑按钮
