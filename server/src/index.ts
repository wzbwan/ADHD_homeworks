import express from 'express';
import cors from 'cors';
import { dashboardRouter } from './routes/dashboard.js';
import { taskRouter } from './routes/tasks.js';
import { habitRouter } from './routes/habits.js';
import { redeemRouter } from './routes/redeem.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/habits', habitRouter);
app.use('/api/redeem', redeemRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
