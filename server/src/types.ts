export enum TaskType {
  MANDATORY = 'MANDATORY',
  OPTIONAL = 'OPTIONAL'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  starsEarned: number;
  maxStars: number;
  isCommon: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  iconKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface DashboardData {
  date: string;
  tasks: Task[];
  habits: Array<Habit & { completed: boolean }>;
  currentScore: number;
}

export interface Redemption {
  id: string;
  reason: string;
  points: number;
  createdAt: string;
}
