import { CreateHabitPayload, CreateTaskPayload, DashboardData } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

const handle = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  return handle(res);
};

export const fetchCommonTasks = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/api/tasks/common`);
  const data = await handle(res);
  return data.tasks;
};

export const createTask = async (payload: CreateTaskPayload) => {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle(res);
};

export const addTasksFromCommon = async (titles: string[]) => {
  const res = await fetch(`${API_BASE}/api/tasks/common`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titles })
  });
  return handle(res);
};

export const completeTask = async (taskId: string, stars: number) => {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stars })
  });
  return handle(res);
};

export const deleteTask = async (taskId: string) => {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.headers.get('content-type') ? handle(res) : {};
};

export const updateHabitStatus = async (habitId: string, completed: boolean) => {
  const res = await fetch(`${API_BASE}/api/habits/${habitId}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return handle(res);
};

export const addHabit = async (payload: CreateHabitPayload) => {
  const res = await fetch(`${API_BASE}/api/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle(res);
};

export const deleteHabit = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/habits/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete habit');
};

export const deleteCommonTask = async (title: string) => {
  const res = await fetch(`${API_BASE}/api/tasks/common/${encodeURIComponent(title)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete common task');
};

export const redeemPoints = async (reason: string, points: number): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/api/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason, points })
  });
  return res.ok;
};
