# Client (孩子端)

## 开发运行
1. `cd client && npm install`
2. 可选：在根目录创建 `.env.local`，设置 `VITE_API_BASE=http://localhost:4000`（默认同端口 4000）。
3. `npm run dev`，浏览器打开显示日常任务、习惯养成、积分兑换，前端每 2s 心跳刷新。

## PWA（iPad 添加到主屏）
- 已包含 `manifest.webmanifest`、`service-worker.js` 和图标。部署后，在 Safari 打开页面 → 分享 → “添加到主屏幕”，即可以全屏独立 App 形式启动。

## 功能对照草图
- 必做/可选任务列表，完成后显示星星。
- 番茄钟计时。
- 习惯单击点亮、长按熄灭，实时同步到后端。
- “支取积分”弹窗，校验积分余额。
