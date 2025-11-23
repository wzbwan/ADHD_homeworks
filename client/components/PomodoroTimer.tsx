import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationMinutes * 60);
  };

  const adjustDuration = (delta: number) => {
    const nextMinutes = Math.max(5, durationMinutes + delta);
    setDurationMinutes(nextMinutes);
    setIsActive(false); // safety: stop current run when changing duration
    setTimeLeft(nextMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = durationMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
      <div className="absolute top-0 left-0 w-24 h-24 bg-red-100 rounded-full blur-3xl opacity-50 -ml-10 -mt-10 pointer-events-none"></div>
      
      <h3 className="text-gray-500 font-display font-semibold mb-4 text-lg">Focus Timer</h3>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <button
          onClick={() => adjustDuration(-5)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          -5m
        </button>
        <span className="font-semibold text-gray-700">{durationMinutes} min</span>
        <button
          onClick={() => adjustDuration(5)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          +5m
        </button>
      </div>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        {/* SVG Progress Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
            className="text-accent transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-3xl font-bold text-gray-700 tabular-nums font-display">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`p-3 rounded-full transition-colors ${
            isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
