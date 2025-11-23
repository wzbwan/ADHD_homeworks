import { db } from '../db.js';
import { Task, TaskStatus, TaskType } from '../types.js';
import { generateId } from '../utils/id.js';
import { ensureDate } from '../utils/date.js';

const mapTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  type: row.type as TaskType,
  date: row.date,
  status: row.status as TaskStatus,
  starsEarned: row.stars_earned,
  maxStars: row.max_stars,
  isCommon: !!row.is_common,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const getTasksForDate = (date: string): Task[] => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE date = ? ORDER BY type DESC, created_at ASC');
  const rows = stmt.all(date);
  return rows.map(mapTask);
};

export const createTask = (title: string, type: TaskType, date?: string, addToCommon = false): Task => {
  const id = generateId();
  const now = new Date().toISOString();
  const targetDate = ensureDate(date);

  const payload = {
    id,
    title,
    type,
    date: targetDate,
    status: TaskStatus.PENDING,
    stars_earned: 0,
    max_stars: 3,
    is_common: addToCommon ? 1 : 0,
    created_at: now,
    updated_at: now
  };

  db.prepare(`
    INSERT INTO tasks (id, title, type, date, status, stars_earned, max_stars, is_common, created_at, updated_at)
    VALUES (@id, @title, @type, @date, @status, @stars_earned, @max_stars, @is_common, @created_at, @updated_at)
  `).run(payload);

  if (addToCommon) {
    db.prepare('INSERT OR IGNORE INTO common_tasks (id, title, created_at) VALUES (?, ?, ?)')
      .run(generateId(), title, now);
  }

  return mapTask({ ...payload });
};

export const addTasksFromCommon = (titles: string[], date?: string): Task[] => {
  const targetDate = ensureDate(date);
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO tasks (id, title, type, date, status, stars_earned, max_stars, is_common, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const created: Task[] = [];

  for (const title of titles) {
    const id = generateId();
    insert.run(id, title, TaskType.MANDATORY, targetDate, TaskStatus.PENDING, 0, 3, 1, now, now);
    created.push(mapTask({
      id,
      title,
      type: TaskType.MANDATORY,
      date: targetDate,
      status: TaskStatus.PENDING,
      stars_earned: 0,
      max_stars: 3,
      is_common: 1,
      created_at: now,
      updated_at: now
    }));
  }

  return created;
};

export const completeTask = (taskId: string, stars: number): Task | null => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as any;
  if (!task) return null;
  if (task.status === TaskStatus.COMPLETED) return mapTask(task);

  const clampedStars = Math.max(1, Math.min(stars, task.max_stars));
  const now = new Date().toISOString();
  db.prepare('UPDATE tasks SET status = ?, stars_earned = ?, updated_at = ? WHERE id = ?')
    .run(TaskStatus.COMPLETED, clampedStars, now, taskId);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as any;
  return mapTask(updated);
};

export const getCommonTasks = (): string[] => {
  const rows = db.prepare('SELECT title FROM common_tasks ORDER BY created_at DESC').all();
  return rows.map((r: any) => r.title);
};

export const deleteTask = (taskId: string) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
};

export const deleteCommonTask = (title: string) => {
  db.prepare('DELETE FROM common_tasks WHERE title = ?').run(title);
};
