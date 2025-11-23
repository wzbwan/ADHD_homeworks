# Manage (家长端)

## 开发运行
1. `cd manage && npm install`
2. 可选：`.env.local` 中设置 `VITE_API_BASE=http://localhost:4000` 指向后端。
3. `npm run dev` 启动。

## 功能
- Tab 切换“今日任务/习惯设置”。
- 今日任务：新增任务（可存入常用列表）、从常用列表批量添加、点击星星完成任务并计分。
- 习惯设置：新增/删除习惯并选择图标。
- 积分兑换弹窗；所有数据每 2s 轮询同步。
