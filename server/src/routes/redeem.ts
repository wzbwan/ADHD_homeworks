import { Router } from 'express';
import { redeemPoints, calculateScore } from '../services/scoreService.js';

export const redeemRouter = Router();

redeemRouter.post('/', (req, res) => {
  const { reason, points } = req.body;
  const amount = Number(points);
  if (!reason || !amount || amount <= 0) {
    return res.status(400).json({ error: 'reason and positive points are required' });
  }
  const ok = redeemPoints(reason, amount);
  if (!ok) {
    return res.status(400).json({ error: 'Not enough points' });
  }
  const currentScore = calculateScore();
  res.json({ ok: true, currentScore });
});
