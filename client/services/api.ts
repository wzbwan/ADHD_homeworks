import { DashboardData, Habit, TaskType } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  return handleResponse(res);
};

export const updateHabitStatus = async (habitId: string, completed: boolean): Promise<{ currentScore: number }> => {
  const res = await fetch(`${API_BASE}/api/habits/${habitId}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return handleResponse(res);
};

export const redeemPoints = async (reason: string, points: number): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/api/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason, points })
  });
  if (!res.ok) return false;
  await res.json();
  return true;
};
