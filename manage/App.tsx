
import React, { useEffect, useState } from 'react';
import { DashboardData, TaskStatus } from './types';
import { 
  fetchDashboardData, 
  updateHabitStatus, 
  redeemPoints, 
  completeTask,
  createTask,
  addTasksFromCommon,
  addHabit,
  deleteHabit,
  deleteTask
} from './services/api';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { HabitTracker } from './components/HabitTracker';
import { HabitSettings } from './components/HabitSettings';
import { ScorePanel } from './components/ScorePanel';
import { RedeemModal } from './components/RedeemModal';
import { NewTaskModal, CommonTaskModal } from './components/TaskModals';
import { Activity, LayoutGrid, Settings2 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits'>('tasks');
  
  // Modal States
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isCommonTaskOpen, setIsCommonTaskOpen] = useState(false);
  
  // Heartbeat Indicator State
  const [pulse, setPulse] = useState(false);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setPulse(true);
    
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      if (!isBackground) setLoading(false);
      setTimeout(() => setPulse(false), 500);
    }
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData(true);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // --- Handlers ---

  const handleCompleteTask = async (taskId: string, stars: number) => {
    // Optimistic update
    if (data) {
      const updatedTasks = data.tasks.map(t => 
        t.id === taskId ? { ...t, status: TaskStatus.COMPLETED, starsEarned: stars } : t
      );
      const pointsAdded = stars * 10;
      setData({ 
        ...data, 
        tasks: updatedTasks,
        currentScore: data.currentScore + pointsAdded
      });
    }
    await completeTask(taskId, stars);
    loadData(true);
  };

  const handleCreateTask = async (title: string, type: any, isCommon: boolean) => {
    setIsNewTaskOpen(false);
    await createTask({ title, type, addToCommon: isCommon });
    loadData(true);
  };

  const handleAddCommonTasks = async (titles: string[]) => {
    setIsCommonTaskOpen(false);
    await addTasksFromCommon(titles);
    loadData(true);
  };

  const handleToggleHabit = async (id: string, completed: boolean) => {
    if (data) {
      const updatedHabits = data.habits.map(h => 
        h.id === id ? { ...h, completed } : h
      );
      setData({ ...data, habits: updatedHabits });
    }
    await updateHabitStatus(id, completed);
  };

  const handleAddHabit = async (name: string, iconKey: string) => {
    await addHabit({ name, iconKey });
    loadData(true);
  };

  const handleDeleteHabit = async (id: string) => {
    await deleteHabit(id);
    loadData(true);
  };

  const handleRedeem = async (reason: string, points: number) => {
    const success = await redeemPoints(reason, points);
    if (success) {
      setIsRedeemOpen(false);
      loadData(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    loadData(true);
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
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-[90vh] min-h-[800px]">
        
        {/* Left Column: Tabs & Main Content */}
        <div className="lg:col-span-5 h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white/50 backdrop-blur-md p-1 rounded-2xl flex gap-1 mb-4 shadow-sm border border-white/50">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                activeTab === 'tasks' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-400 hover:bg-white/30'
              }`}
            >
              <LayoutGrid size={18} />
              Today's Tasks
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                activeTab === 'habits' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-400 hover:bg-white/30'
              }`}
            >
              <Settings2 size={18} />
              Habit Config
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 min-h-0">
            {activeTab === 'tasks' ? (
              <TaskList 
                tasks={data?.tasks || []} 
                todayDate={data?.date || ''}
                onCompleteTask={handleCompleteTask}
                onAddNewClick={() => setIsNewTaskOpen(true)}
                onAddFromListClick={() => setIsCommonTaskOpen(true)}
                onDeleteTask={handleDeleteTask}
              />
            ) : (
              <HabitSettings 
                habits={data?.habits || []}
                onAddHabit={handleAddHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}
          </div>
        </div>

        {/* Right Column: Widgets & Tracker */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-y-auto lg:overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
            <PomodoroTimer />
            {data && (
              <ScorePanel 
                score={data.currentScore} 
                onRedeemClick={() => setIsRedeemOpen(true)} 
              />
            )}
          </div>
          
          {/* Always Visible Habit Tracker */}
          {data && (
            <HabitTracker 
              habits={data.habits} 
              onToggleHabit={handleToggleHabit} 
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <RedeemModal 
        isOpen={isRedeemOpen} 
        onClose={() => setIsRedeemOpen(false)} 
        onConfirm={handleRedeem}
        maxPoints={data?.currentScore || 0}
      />
      
      <NewTaskModal 
        isOpen={isNewTaskOpen} 
        onClose={() => setIsNewTaskOpen(false)} 
        onConfirm={handleCreateTask}
      />

      <CommonTaskModal
        isOpen={isCommonTaskOpen}
        onClose={() => setIsCommonTaskOpen(false)}
        onConfirm={handleAddCommonTasks}
      />

      {/* Heartbeat */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-gray-400 pointer-events-none z-50">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${pulse ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
        Syncing
      </div>
    </div>
  );
};

export default App;
