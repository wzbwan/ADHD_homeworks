# 工作计划（草案）

## 1) 需求对齐
- 客户端：展示每日必做/可选任务及星级、习惯养成九宫格、番茄钟、积分显示与“支取积分”弹窗；每 2 秒心跳刷新任务列表、习惯状态、当前积分；完成任务后应显示已得星星；习惯单击点亮、长按熄灭并持久化。
- 管理端：Tab 切换“今日任务 / 习惯设置”；支持新增任务、从常用列表批量添加、标记任务完成并打星；支持新增/删除习惯并选择图标；可查看今日日期但不编辑历史；常用任务维护。
- 后端：SQLite 持久化；提供任务/习惯/积分/兑换接口；根据完成情况给 1-3 星并累计积分；习惯完成计入积分；兑换扣减积分；满足 2 秒心跳拉取。

## 2) 技术与数据方案
- 后端技术栈：Node.js + Express + TypeScript，使用 `better-sqlite3` 简化同步查询；采用简单的服务层封装，支持 CORS。
- 数据模型（初版）：
  - `tasks`：id, title, type (MANDATORY/OPTIONAL), date (YYYY-MM-DD), status (PENDING/COMPLETED), stars_earned, max_stars, is_common, created_at, updated_at。
  - `common_tasks`：id, title, created_at。
  - `habits`：id, name, icon_key, created_at, updated_at。
  - `habit_logs`：id, habit_id, date, completed (bool), created_at。
  - `redemptions`：id, reason, points, created_at。
  - 积分计算：任务得分 = stars_earned * 10；习惯得分 = 完成 +5 / 取消 -5（单日只计一次）；总分 = 任务得分 + 习惯得分累计 - 兑换扣减。
- API 设计（主要）：
  - `GET /api/dashboard?date=YYYY-MM-DD`：返回当日任务、习惯完成状态、当前积分。
  - 任务：`POST /api/tasks`（新增，支持标记是否加入常用）、`POST /api/tasks/common`（从常用列表批量添加到今日）、`GET /api/tasks/common`、`POST /api/tasks/:id/complete`（body: stars 1-3）。
  - 习惯：`GET /api/habits`、`POST /api/habits`、`DELETE /api/habits/:id`、`POST /api/habits/:id/toggle`（body: completed bool, date 可选默认今日）。
  - 积分与兑换：`POST /api/redeem`（reason, points）。
  - 公共：错误码/校验、简单 rate limit/日志可选（视时间）。

## 3) 后端落地步骤
- 搭建 Express + TypeScript 项目结构于 `server/`，包含配置、路由、控制器、服务、模型、db 初始化与种子数据。
- 初始化 SQLite（含 seed：示例任务/习惯/常用任务与初始积分=0/或根据星星预计算）。
- 实现任务服务：创建/批量创建（from common）、完成打星（幂等检查 PENDING 才能完成），返回最新积分。
- 实现习惯服务：增删习惯、按日切换完成状态（长按熄灭），更新积分。
- 实现兑换服务：校验积分够再扣减并记录理由。
- 聚合接口 `dashboard`：汇总当日日程与积分（从任务得分 + 习惯得分 - 兑换）。
- 添加 CORS、JSON 解析、中间件和基本错误处理；提供 npm scripts（dev/start/db reset 等）。

## 4) 前端改造计划
- 抽离共享类型/接口（可在 `/shared` 或分别同步定义）保持与后端一致。
- 客户端（`client/`）：将 `services/mockBackend` 换成真实 API 调用（fetch/axios），保留 2 秒轮询；处理任务完成状态由后端推送的星星值；支取积分 modal 调用兑换接口；习惯点亮/熄灭调接口并在下次心跳同步。
- 管理端（`manage/`）：替换 mock 服务为 API；新增任务（可加入常用）、从常用列表批量添加；打星完成任务走后端；习惯新增/删除接入后端；两端共享日期格式与心跳刷新。
- 样式/UI：保持现有 demo 视觉，按草图验证交互（星星点击完成、习惯点亮、兑换弹窗流程）。

## 5) 测试与验证
- 后端：单元/轻量集成测试覆盖任务完成、习惯切换、积分计算、兑换失败/成功、常用任务添加；可用 supertest。
- 手动联调：启动 server + 两个 Vite 项目，验证 2 秒心跳实时刷新、任务打星、习惯点亮/熄灭、积分累加与兑换扣减、常用任务批量添加。
- 检查边界：重复完成任务禁止再次加分、兑换超额提示、习惯重复切换同日不会重复加分。

## 6) 交付与文档
- 更新 README（运行后端、客户端、管理端步骤、环境变量说明、默认端口/API 概览）。
- 如需脚本：`npm run seed`/`npm run dev` 等。
- 提供未来可扩展建议（鉴权、历史数据、持久通知等）供后续选择。
