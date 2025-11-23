import { Router } from 'express';
import { getTasksForDate } from '../services/taskService.js';
import { listHabitsWithState } from '../services/habitService.js';
import { calculateScore } from '../services/scoreService.js';
import { ensureDate } from '../utils/date.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', (req, res) => {
  const date = ensureDate(req.query.date as string | undefined);
  const tasks = getTasksForDate(date);
  const habits = listHabitsWithState(date);
  const currentScore = calculateScore();

  res.json({ date, tasks, habits, currentScore });
});
