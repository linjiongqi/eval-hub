# EvalHub 后端任务拆分

**参考文档：** `doc/design.md`、`doc/functional-design-zh.md`
**技术栈：** FastAPI · PostgreSQL · SQLAlchemy (async) · Alembic · Pydantic v2 · python-jose · bcrypt · fastapi-mail

---

## 约定

### 权限守卫说明
每个接口标注所需角色。后端统一通过 `Depends(require_role(['admin']))` 实现：
- `[Public]` — 无需登录
- `[Auth]` — 任意已登录用户
- `[Evaluator+]` — Evaluator 或 Admin
- `[Admin]` — 仅 Admin

### NFS 文件路径规范
```
/mnt/nfs/
├── benchmarks/{benchmark_id}/samples/{sample_id}/
│   ├── ref_image.{ext}
│   └── ref_video.{ext}          # 可选
└── models/{model_id}/{benchmark_id}/{sample_id}.{ext}
```
数据库只存相对路径，FastAPI 通过 `StaticFiles` 挂载 `/mnt/nfs` 为 `/static`，前端访问 `/static/...`。

### Activity Log 触发规则
以下操作**在同一事务内**写入 `activity_logs`：
- 投票提交（Task 7）
- 模型结果上传（Task 5）
- 创建实验（Task 6）
- 注册模型（Task 5）

Task 9 只负责 `GET /api/v1/activity-logs` 查询接口。

---

## Task 1 — 项目初始化

**目录结构：**
```
backend/
├── main.py
├── config.py          # pydantic-settings 读取 .env
├── database.py        # async SQLAlchemy engine + session
├── dependencies.py    # get_db, get_current_user, require_role
├── models/            # SQLAlchemy ORM 模型（每个资源一个文件）
├── schemas/           # Pydantic 请求/响应模型
├── routers/           # 路由文件
├── utils/
│   ├── auth.py        # JWT 签发/验证
│   ├── email.py       # 邮件发送
│   └── files.py       # NFS 文件读写工具
└── alembic/           # 数据库迁移
```

**依赖安装：**
```
fastapi uvicorn sqlalchemy[asyncio] asyncpg alembic
pydantic-settings pydantic[email]
python-jose[cryptography] bcrypt passlib
fastapi-mail python-multipart aiofiles
```

**环境变量（`.env`）：**
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/evalhub
JWT_SECRET=<random-secret>
JWT_EXPIRE_MINUTES=480
OKTA_DOMAIN=https://your-org.okta.com
OKTA_CLIENT_ID=...
OKTA_CLIENT_SECRET=...
NFS_MOUNT_PATH=/mnt/nfs
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=noreply@eval.heygen.com
FRONTEND_URL=https://eval.heygen.com
```

**成功标准：** `uvicorn main:app --reload` 启动，`GET /health` 返回 `{"status": "ok"}`。

---

## Task 2 — 数据库 Schema（Alembic）

按以下顺序建表（注意外键依赖）：

```sql
-- 1. users
-- 2. user_invitations
-- 3. benchmarks
-- 4. benchmark_version_log
-- 5. samples
-- 6. models
-- 7. model_versions
-- 8. model_results
-- 9. experiments
-- 10. experiment_models
-- 11. experiment_evaluators
-- 12. votes
-- 13. vote_video_feedback
-- 14. metrics
-- 15. objective_scores
-- 16. score_upload_logs
-- 17. activity_logs
```

完整 DDL 见 `design.md` 第 8.3、8.5、8.7、8.9、8.11、8.12 节。

**关键索引（性能）：**
```sql
CREATE INDEX idx_votes_experiment_sample   ON votes(experiment_id, sample_id);
CREATE INDEX idx_votes_evaluator           ON votes(evaluator_id);
CREATE INDEX idx_objective_scores_lookup   ON objective_scores(model_id, benchmark_id, metric_name);
CREATE INDEX idx_activity_logs_created_at  ON activity_logs(created_at DESC);
CREATE INDEX idx_model_results_lookup      ON model_results(model_id, benchmark_id);
```

**成功标准：** `alembic upgrade head` 无报错，`\dt` 列出 17 张表。

---

## Task 3 — Auth & Users

### API 接口

**Okta SSO（内部员工）：**
```
GET  /api/v1/auth/okta/login     [Public]  → 302 跳转 Okta 授权页
GET  /api/v1/auth/okta/callback  [Public]  → 换 token，首次登录自动建 user，返回 JWT
```

**Email + Password（Freelancer）：**
```
POST /api/v1/auth/login   [Public]
  Body: { email, password }
  Response: { access_token, token_type: "bearer", user: { user_id, name, role, auth_type } }

POST /api/v1/auth/logout  [Auth]   → 200 OK（客户端清 token，服务端 no-op）
GET  /api/v1/auth/me      [Auth]   → 返回当前用户完整信息
```

**邀请流程：**
```
POST /api/v1/invitations              [Admin]
  Body: { email, role }
  → 生成 token（secrets.token_urlsafe(32)），写 user_invitations
  → 发送邮件（fastapi-mail）：链接 = {FRONTEND_URL}/register?token={token}
  → Response: { invitation_id, email, expires_at }

GET  /api/v1/invitations/{token}      [Public]
  → 验证 token 存在且未过期未使用
  → Response: { email, role, expires_at } 或 404

POST /api/v1/invitations/{token}/accept  [Public]
  Body: { name, password }
  → 验证 token，创建 user（auth_type='password', bcrypt hash），标记 accepted_at
  → Response: { access_token, token_type, user }
```

**用户管理：**
```
GET    /api/v1/users              [Admin]  → 用户列表
PATCH  /api/v1/users/{user_id}   [Admin]  Body: { role?, name? }
DELETE /api/v1/users/{user_id}   [Admin]  → is_active = false（软删除）
```

**权限守卫实现：**
```python
# dependencies.py
def require_role(roles: list[str]):
    async def check(current_user = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(403, "Insufficient permissions")
        return current_user
    return check
```

---

## Task 4 — Benchmark & Samples

### API 接口

```
GET    /api/v1/benchmarks                                      [Auth]
  Query: ?search=&version=&sort=name|samples|date
  Response: [{ benchmark_id, name, version, status, sample_count, created_at }]

POST   /api/v1/benchmarks                                      [Admin]
  Body: multipart/form-data { name, version, samples[]: { text_prompt, ref_image, ref_video? } }

GET    /api/v1/benchmarks/{benchmark_id}                       [Auth]
  Response: benchmark + samples 列表

PATCH  /api/v1/benchmarks/{benchmark_id}                       [Admin]
  Body: { name?, version? }
  → 若 version 变更：写一条 benchmark_version_log

DELETE /api/v1/benchmarks/{benchmark_id}                       [Admin]

GET    /api/v1/benchmarks/{benchmark_id}/samples               [Auth]
POST   /api/v1/benchmarks/{benchmark_id}/samples               [Admin]
  → sample_id 自增逻辑：SELECT MAX(sample_id) FROM samples WHERE benchmark_id = ? → +1
  → 文件写入 NFS: /mnt/nfs/benchmarks/{benchmark_id}/samples/{sample_id}/ref_image.{ext}

DELETE /api/v1/benchmarks/{benchmark_id}/samples/{sample_id}   [Admin]

GET    /api/v1/benchmarks/{benchmark_id}/download              [Auth]
  → StreamingResponse + zipfile
  → Zip 结构：
    portrait50/
    ├── metadata.json          # 所有样本的 text_prompt 列表
    ├── samples/
    │   ├── 001/
    │   │   ├── ref_image.jpg
    │   │   └── ref_video.mp4  # 若有
    │   ├── 002/
    ...
```

---

## Task 5 — Model Management

### API 接口

```
GET    /api/v1/models                    [Auth]
POST   /api/v1/models                    [Admin]
  Body: { name, type, version }
  → 写 models + model_versions（第一条）
  → 写 activity_log: { action: 'registered_model', entity: '{name} {version}' }

GET    /api/v1/models/{model_id}         [Auth]
  Response: model + version_history（按时间倒序）+ 每个 benchmark 的上传状态

PATCH  /api/v1/models/{model_id}         [Admin]
DELETE /api/v1/models/{model_id}         [Admin]

POST   /api/v1/models/{model_id}/results  [Admin]
  Body: multipart/form-data
    { benchmark_id, version, results[]: { sample_id, video: File } }

  处理逻辑：
  1. 验证 model_id 和 benchmark_id 存在
  2. 对每个文件：写入 /mnt/nfs/models/{model_id}/{benchmark_id}/{sample_id}.{ext}
  3. INSERT INTO model_results ... ON CONFLICT (model_id, benchmark_id, sample_id)
     DO UPDATE SET video_path = EXCLUDED.video_path, version = EXCLUDED.version
     （冲突时覆盖，不报错）
  4. 若 version 不在 model_versions 中，新增一条 model_versions 记录
  5. 写 activity_log
  Response: { status: "success", records_created: N }

GET    /api/v1/models/{model_id}/results  [Auth]
  Query: ?benchmark_id=
  Response: [{ benchmark_id, sample_id, video_url, version, uploaded_at }]
```

---

## Task 6 — Experiment CRUD

### API 接口

```
GET    /api/v1/experiments               [Auth]
  Response: [{ experiment_id, name, benchmark_name, model_names, status, progress, created_at }]

POST   /api/v1/experiments               [Admin]
  Body: { name, benchmark_id, model_ids[], evaluator_ids[] }
  → display_labels 按 model_ids 顺序分配：['Model A', 'Model B', ...]
  → 写 experiments + experiment_models + experiment_evaluators
  → 写 activity_log: { action: 'created_experiment', entity: name }
  Response: { experiment_id, ... }

GET    /api/v1/experiments/{experiment_id}  [Auth]
  Response: experiment + model_ids/names/display_labels + evaluator_ids + progress

PATCH  /api/v1/experiments/{experiment_id}  [Admin]
  Body: { status? }

DELETE /api/v1/experiments/{experiment_id}  [Admin]

GET    /api/v1/dashboard/stats              [Auth]
  Response:
  {
    active_experiments: int,    -- COUNT WHERE status='active'
    total_models: int,
    total_benchmarks: int,
    weekly_evaluations: int     -- COUNT votes WHERE created_at > now()-7days AND NOT is_skipped
  }
```

---

## Task 7 — 评测流程

### API 接口

```
GET /api/v1/experiments/{experiment_id}/samples/{sample_id}  [Evaluator+]
  Response:
  {
    sample: { sample_id, text_prompt, ref_image_url, ref_video_url },
    videos: [
      { model_id, display_label, video_url },  -- 按 display_labels 顺序，不暴露真实 model_name
      { model_id, display_label, video_url }
    ],
    my_vote: {                                 -- 当前评测员在本实验的投票（若已投）
      winner_model_id, is_tie, is_skipped, pick_reason,
      feedback: [{ model_id, comment, issue_tags }]
    } | null
  }

POST /api/v1/experiments/{experiment_id}/votes  [Evaluator+]
  Body:
  {
    sample_id: int,
    winner_model_id: str | null,   -- null 表示平局或跳过
    is_tie: bool,
    is_skipped: bool,
    pick_reason: str | null,
    feedback: [
      { model_id: str, comment: str | null, issue_tags: str[] }
    ]
  }
  处理逻辑：
  1. INSERT INTO votes ... ON CONFLICT (experiment_id, sample_id, evaluator_id) DO UPDATE
  2. DELETE + INSERT vote_video_feedback（整体替换）
  3. 写 activity_log: { action: 'voted_on', entity: formatSampleId(benchmark_id, sample_id) }
  Response: { vote_id, created_at }

GET /api/v1/experiments/{experiment_id}/votes/{sample_id}  [Evaluator+]
  → 当前实验当前样本的投票记录（当前用户）
  Response: 同 my_vote 结构

GET /api/v1/samples/history  [Evaluator+]
  Query: ?benchmark_id=&sample_id=
  → evaluator_id 从 JWT 取，不作为参数暴露
  → 查询：同一评测员在其他实验中对同一 benchmark+sample 的标注
  Response:
  [
    {
      experiment_id, experiment_name,
      winner_model_id, is_tie, pick_reason,
      feedback: [{ model_id, comment, issue_tags }],
      created_at
    }
  ]
```

---

## Task 8 — 实验结果聚合

### API 接口

```
GET /api/v1/experiments/{experiment_id}/results  [Auth]
  Response:
  {
    win_rates: {
      model_a: { model_id, model_name, wins: int, win_pct: float },
      model_b: { model_id, model_name, wins: int, win_pct: float },
      tie_skip: { count: int, pct: float }
    },
    objective_scores: [
      {
        metric_name: str,
        metric_label: str,
        scores: [
          { model_id, model_name, mean: float, std: float }
        ]
      }
    ],                        -- 5 个指标：lip_sync, clarity, naturalness, motion_quality, identity_preservation
    evaluator_leaderboard: [
      { evaluator_id, evaluator_name, completed: int, total: int }
    ]
  }

GET /api/v1/experiments/{experiment_id}/results/samples  [Auth]
  Response:
  [
    {
      sample_id: int,
      sample_address: str,           -- formatSampleId 结果，如 portrait50_012
      winner_model_id: str | null,
      winner_model_name: str | null, -- 真实模型名（结果页披露）
      is_tie: bool,
      is_skipped: bool,
      evaluator_name: str,
      pick_reason: str | null,
      objective_scores: [            -- 用于迷你条形图和雷达图
        { metric_name, model_id, score }
      ],
      feedback: [
        { model_id, comment, issue_tags }
      ]
    }
  ]
```

**均值±标准差计算：**
```python
import statistics
scores = [s.score for s in model_scores]
mean = statistics.mean(scores)
std  = statistics.stdev(scores) if len(scores) > 1 else 0.0
```

---

## Task 9 — Objective Scores + Activity Log

### API 接口

**Metrics：**
```
GET    /api/v1/metrics                   [Auth]
POST   /api/v1/metrics                   [Admin]
  Body: { metric_name, name, description, range_min, range_max, icon }
PATCH  /api/v1/metrics/{metric_name}     [Admin]
DELETE /api/v1/metrics/{metric_name}     [Admin]
```

**评分上传（同步处理）：**
```
POST /api/v1/scores/upload  [Admin]
  Body:
  {
    model_id: str,
    benchmark_id: str,
    metric_name: str,
    scores: [{ sample_id: int, score: float }]
  }

  处理逻辑（同步，无队列）：
  1. 写 score_upload_logs，status='processing'
  2. 验证 metric_name 存在、score 在 range 内
  3. INSERT INTO objective_scores ... ON CONFLICT DO UPDATE
  4. 更新 score_upload_logs.status = 'success'
  5. 若任意步骤失败：status = 'failed'，error_msg = 异常信息
  Response: { status: "success", records_created: N }
```

> **注：** `status: 'processing'` 在同步实现中仅在极短时间内存在（写 log 到结束前）。若未来改异步，只需把步骤 2-3 移入 BackgroundTask 即可，接口层不变。

**评分查询：**
```
GET /api/v1/scores  [Auth]
  Query: ?model_id=&benchmark_id=&metric_name=&sample_id=
  Response: [{ model_id, benchmark_id, metric_name, sample_id, score }]

GET /api/v1/scores/upload-logs  [Auth]
  Response: [{ id, model_name, benchmark_name, metric_name, sample_count, status, error_msg, uploaded_at, uploaded_by }]
```

**Activity Log：**
```
GET /api/v1/activity-logs  [Auth]
  Query: ?limit=20
  Response: [{ id, user_name, action, entity, created_at }]
```

---

## 依赖顺序

```
Task 1（初始化）
  ↓
Task 2（建表）
  ↓
Task 3（Auth）
  ↓
Task 4（Benchmark）── Task 5（Model）── Task 6（Experiment + Dashboard Stats）
                                              ↓
                                        Task 7（投票）
                                              ↓
                                        Task 8（结果聚合）
                                              ↓
                                        Task 9（Scores + ActivityLog 查询接口）
```

Task 4、5、6 可并行，Task 7 需要 Task 4+5+6 完成后才能测试完整流程。
