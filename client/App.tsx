import React, { useEffect, useState } from 'react';
import { DashboardData, TaskStatus } from './types';
import { fetchDashboardData, updateHabitStatus, redeemPoints } from './services/api';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { HabitTracker } from './components/HabitTracker';
import { ScorePanel } from './components/ScorePanel';
import { RedeemModal } from './components/RedeemModal';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Heartbeat Indicator State
  const [pulse, setPulse] = useState(false);

  // 1. Initial Load & 2. Polling Strategy
  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setPulse(true); // Visual indicator start
    
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      if (!isBackground) setLoading(false);
      setTimeout(() => setPulse(false), 500); // Visual indicator end
    }
  };

  useEffect(() => {
    // Initial fetch
    loadData();

    // Heartbeat: Poll every 2 seconds as requested
    const intervalId = setInterval(() => {
      loadData(true);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleToggleHabit = async (id: string, completed: boolean) => {
    // Optimistic update for immediate UI response
    if (data) {
      const updatedHabits = data.habits.map(h => 
        h.id === id ? { ...h, completed } : h
      );
      setData({ ...data, habits: updatedHabits });
    }

    // API call
    await updateHabitStatus(id, completed);
    // Data will re-sync on next poll
  };

  const handleRedeem = async (reason: string, points: number) => {
    const success = await redeemPoints(reason, points);
    if (success) {
      setIsModalOpen(false);
      loadData(true); // Force immediate refresh
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin text-indigo-500">
          <Activity size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center font-sans text-slate-800">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[800px]">
        
        {/* Left Column: Tasks */}
        <div className="lg:col-span-5 h-full">
          {data && <TaskList tasks={data.tasks} todayDate={data.date} />}
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pomodoro */}
            <PomodoroTimer />
            
            {/* Score & Redeem */}
            {data && (
              <ScorePanel 
                score={data.currentScore} 
                onRedeemClick={() => setIsModalOpen(true)} 
              />
            )}
          </div>

          {/* Habits */}
          {data && (
            <HabitTracker 
              habits={data.habits} 
              onToggleHabit={handleToggleHabit} 
            />
          )}

        </div>
      </div>

      {/* Redemption Modal */}
      <RedeemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleRedeem}
        maxPoints={data?.currentScore || 0}
      />

      {/* Heartbeat Status Indicator (Bottom Right) */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-gray-400">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${pulse ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
        System Online
      </div>
    </div>
  );
};

export default App;
