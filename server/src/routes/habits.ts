import { Router } from 'express';
import { addHabit, deleteHabit, listHabitsWithState, toggleHabit } from '../services/habitService.js';
import { calculateScore } from '../services/scoreService.js';
import { ensureDate } from '../utils/date.js';

export const habitRouter = Router();

habitRouter.get('/', (req, res) => {
  const date = ensureDate(req.query.date as string | undefined);
  const habits = listHabitsWithState(date);
  res.json({ habits });
});

habitRouter.post('/', (req, res) => {
  const { name, iconKey } = req.body;
  if (!name || !iconKey) {
    return res.status(400).json({ error: 'name and iconKey are required' });
  }
  const habit = addHabit(name, iconKey);
  res.status(201).json({ habit });
});

habitRouter.delete('/:id', (req, res) => {
  deleteHabit(req.params.id);
  res.status(204).send();
});

habitRouter.post('/:id/toggle', (req, res) => {
  const { completed, date } = req.body;
  const targetDate = ensureDate(date);
  toggleHabit(req.params.id, !!completed, targetDate);
  const currentScore = calculateScore();
  res.json({ ok: true, currentScore });
});
