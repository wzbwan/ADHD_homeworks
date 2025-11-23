import Database from 'better-sqlite3';
import { TaskType, TaskStatus } from './types.js';
import { todayISO } from './utils/date.js';
import { generateId } from './utils/id.js';

export const db = new Database('app.db');

const init = () => {
  db.pragma('journal_mode = WAL');

  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      stars_earned INTEGER NOT NULL DEFAULT 0,
      max_stars INTEGER NOT NULL DEFAULT 3,
      is_common INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS common_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(habit_id, date)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      reason TEXT NOT NULL,
      points INTEGER NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();

  seed();
};

const seed = () => {
  const today = todayISO();

  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
  if (taskCount.count === 0) {
    const seedTasks = [
      { title: 'Finish Math Homework', type: TaskType.MANDATORY, max: 3 },
      { title: 'Clean Room', type: TaskType.MANDATORY, max: 3 },
      { title: 'Practice Piano (30m)', type: TaskType.MANDATORY, max: 3 },
      { title: 'Read a Book', type: TaskType.OPTIONAL, max: 2 },
      { title: 'Help with Dishes', type: TaskType.OPTIONAL, max: 2 },
      { title: 'Draw a Picture', type: TaskType.OPTIONAL, max: 1 }
    ];

    const insert = db.prepare(`
      INSERT INTO tasks (id, title, type, date, status, stars_earned, max_stars, is_common, created_at, updated_at)
      VALUES (@id, @title, @type, @date, @status, @stars_earned, @max_stars, @is_common, @created_at, @updated_at)
    `);

    const now = new Date().toISOString();
    for (const t of seedTasks) {
      insert.run({
        id: generateId(),
        title: t.title,
        type: t.type,
        date: today,
        status: TaskStatus.PENDING,
        stars_earned: 0,
        max_stars: t.max,
        is_common: 0,
        created_at: now,
        updated_at: now
      });
    }
  }

  const commonCount = db.prepare('SELECT COUNT(*) as count FROM common_tasks').get() as { count: number };
  if (commonCount.count === 0) {
    const commons = [
      'Fold Laundry',
      'Walk the Dog',
      'Empty Dishwasher',
      'Water Plants',
      'Tidy Desk',
      'Read 20 Pages'
    ];
    const insert = db.prepare('INSERT INTO common_tasks (id, title, created_at) VALUES (?, ?, ?)');
    const now = new Date().toISOString();
    commons.forEach(title => insert.run(generateId(), title, now));
  }

  const habitCount = db.prepare('SELECT COUNT(*) as count FROM habits').get() as { count: number };
  if (habitCount.count === 0) {
    const habits = [
      { name: 'Brush Teeth', icon_key: 'smile' },
      { name: 'Drink Water', icon_key: 'droplet' },
      { name: 'Exercise', icon_key: 'activity' },
      { name: 'Sleep Early', icon_key: 'moon' },
      { name: 'Eat Veggies', icon_key: 'carrot' },
      { name: 'No TV', icon_key: 'tv-off' },
      { name: 'Tidy Desk', icon_key: 'monitor' },
      { name: 'Kindness', icon_key: 'heart' }
    ];
    const insert = db.prepare('INSERT INTO habits (id, name, icon_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
    const now = new Date().toISOString();
    habits.forEach(h => insert.run(generateId(), h.name, h.icon_key, now, now));
  }
};

init();
