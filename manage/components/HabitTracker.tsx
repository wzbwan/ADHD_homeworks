import React, { useRef, useState } from 'react';
import { Habit } from '../types';
import { Smile, Droplets, Activity, Moon, Carrot, Tv, Monitor, Heart, Hexagon } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string, completed: boolean) => void;
}

// Icon mapping
const IconMap: Record<string, React.FC<any>> = {
  smile: Smile,
  droplet: Droplets,
  activity: Activity,
  moon: Moon,
  carrot: Carrot,
  'tv-off': Tv,
  monitor: Monitor,
  heart: Heart,
  default: Hexagon
};

const HabitItem: React.FC<{ habit: Habit; onToggle: (id: string, state: boolean) => void }> = ({ habit, onToggle }) => {
  const Icon = IconMap[habit.iconKey] || IconMap.default;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  // Interaction Logic
  const handleMouseDown = () => {
    setIsPressing(true);
    timeoutRef.current = setTimeout(() => {
      // Long press detected (turn off)
      onToggle(habit.id, false);
      setIsPressing(false);
    }, 600); // 600ms threshold
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (isPressing) {
        // Short press detected (turn on)
        // If it was already completed, short press does nothing based on "Click to light up" 
        // But usually toggling is expected. 
        // Following requirement: "Click to light up (True), Long press to extinguish (False)"
        if (!habit.completed) {
            onToggle(habit.id, true);
        }
      }
    }
    setIsPressing(false);
  };

  const handleTouchStart = () => {
      handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      e.preventDefault(); // Prevent ghost clicks
      handleMouseUp();
  };

  return (
    <div
      className="flex flex-col items-center gap-2 select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
         setIsPressing(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`
            w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 transform
            ${isPressing ? 'scale-90' : 'hover:scale-105'}
            ${habit.completed 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200' 
                : 'bg-gray-100 text-gray-400 inner-shadow'}
        `}
      >
        <Icon 
            size={32} 
            className={`transition-colors duration-300 ${habit.completed ? 'text-white' : 'text-gray-400'}`} 
            strokeWidth={habit.completed ? 2.5 : 2}
        />
      </div>
      <span className={`text-xs font-semibold ${habit.completed ? 'text-green-600' : 'text-gray-400'}`}>
        {habit.name}
      </span>
    </div>
  );
};

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden flex-1">
       <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="text-gray-800 font-display font-bold text-xl">Daily Habits</h3>
        <span className="text-xs text-gray-400 font-medium bg-white/50 px-2 py-1 rounded-md border border-gray-100">
          Tap = On • Hold = Off
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 place-items-center">
        {habits.map(habit => (
          <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
        ))}
      </div>
    </div>
  );
};