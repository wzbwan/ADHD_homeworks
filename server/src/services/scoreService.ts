import { db } from '../db.js';

const TASK_POINT_PER_STAR = 10;
const HABIT_POINT_VALUE = 5;

export const calculateScore = (): number => {
  const taskPointsRow = db.prepare('SELECT SUM(stars_earned) as total FROM tasks WHERE status = ?').get('COMPLETED') as { total: number | null };
  const taskPoints = (taskPointsRow.total || 0) * TASK_POINT_PER_STAR;

  const habitRow = db.prepare('SELECT COUNT(*) as total FROM habit_logs WHERE completed = 1').get() as { total: number };
  const habitPoints = (habitRow.total || 0) * HABIT_POINT_VALUE;

  const redemptionRow = db.prepare('SELECT SUM(points) as total FROM redemptions').get() as { total: number | null };
  const redeemed = redemptionRow.total || 0;

  return taskPoints + habitPoints - redeemed;
};

export const redeemPoints = (reason: string, points: number): boolean => {
  const current = calculateScore();
  if (points > current) return false;
  const now = new Date().toISOString();
  db.prepare('INSERT INTO redemptions (id, reason, points, created_at) VALUES (?, ?, ?, ?)')
    .run(Math.random().toString(36).slice(2, 10), reason, points, now);
  return true;
};
