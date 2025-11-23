import { Router } from 'express';
import { addTasksFromCommon, completeTask, createTask, getCommonTasks, deleteTask, deleteCommonTask } from '../services/taskService.js';
import { calculateScore } from '../services/scoreService.js';
import { TaskType } from '../types.js';

export const taskRouter = Router();

taskRouter.post('/', (req, res) => {
  const { title, type, addToCommon = false, date } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'title and type are required' });
  }
  if (!Object.values(TaskType).includes(type)) {
    return res.status(400).json({ error: 'Invalid task type' });
  }
  const task = createTask(title, type, date, addToCommon);
  const currentScore = calculateScore();
  res.status(201).json({ task, currentScore });
});

taskRouter.post('/common', (req, res) => {
  const { titles, date } = req.body;
  if (!Array.isArray(titles) || titles.length === 0) {
    return res.status(400).json({ error: 'titles array required' });
  }
  const tasks = addTasksFromCommon(titles, date);
  const currentScore = calculateScore();
  res.status(201).json({ tasks, currentScore });
});

taskRouter.get('/common', (_req, res) => {
  res.json({ tasks: getCommonTasks() });
});

taskRouter.post('/:id/complete', (req, res) => {
  const { stars } = req.body;
  const parsedStars = Number(stars) || 1;
  const task = completeTask(req.params.id, parsedStars);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const currentScore = calculateScore();
  res.json({ task, currentScore });
});

taskRouter.delete('/common/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title);
  deleteCommonTask(title);
  res.status(204).send();
});

taskRouter.delete('/:id', (req, res) => {
  deleteTask(req.params.id);
  const currentScore = calculateScore();
  res.json({ currentScore });
});
