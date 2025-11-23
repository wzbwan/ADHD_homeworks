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
  status: TaskStatus;
  starsEarned: number; // 0 if pending, 1-3 if completed
  maxStars: number;
  date?: string;
  isCommon?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  iconKey: string; // string identifier for icon component
  completed: boolean;
}

export interface DashboardData {
  date: string;
  tasks: Task[];
  habits: Habit[];
  currentScore: number;
}

export interface RedeemRequest {
  reason: string;
  points: number;
}
