import { db } from '../db.js';
import { Habit } from '../types.js';
import { ensureDate } from '../utils/date.js';
import { generateId } from '../utils/id.js';

const mapHabit = (row: any): Habit => ({
  id: row.id,
  name: row.name,
  iconKey: row.icon_key,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const listHabitsWithState = (date: string): Array<Habit & { completed: boolean }> => {
  const habits = db.prepare('SELECT * FROM habits ORDER BY created_at ASC').all() as any[];
  const logs = db.prepare('SELECT habit_id, completed FROM habit_logs WHERE date = ?').all(date) as any[];
  const completedMap = new Map<string, boolean>();
  logs.forEach((l: any) => completedMap.set(l.habit_id, !!l.completed));

  const habitList: Habit[] = habits.map(mapHabit);
  return habitList.map((h: Habit) => ({
    ...h,
    completed: completedMap.get(h.id) || false
  }));
};

export const toggleHabit = (habitId: string, completed: boolean, date?: string) => {
  const targetDate = ensureDate(date);
  const existing = db.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?').get(habitId, targetDate) as any;
  const now = new Date().toISOString();
  if (existing) {
    db.prepare('UPDATE habit_logs SET completed = ?, created_at = ? WHERE id = ?')
      .run(completed ? 1 : 0, now, existing.id);
  } else {
    db.prepare('INSERT INTO habit_logs (id, habit_id, date, completed, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(generateId(), habitId, targetDate, completed ? 1 : 0, now);
  }
};

export const addHabit = (name: string, iconKey: string): Habit => {
  const now = new Date().toISOString();
  const habit: Habit = {
    id: generateId(),
    name,
    iconKey,
    createdAt: now,
    updatedAt: now
  };
  db.prepare('INSERT INTO habits (id, name, icon_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(habit.id, habit.name, habit.iconKey, habit.createdAt, habit.updatedAt);
  return habit;
};

export const deleteHabit = (habitId: string) => {
  db.prepare('DELETE FROM habit_logs WHERE habit_id = ?').run(habitId);
  db.prepare('DELETE FROM habits WHERE id = ?').run(habitId);
};
