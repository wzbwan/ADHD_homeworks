
import React, { useState } from 'react';
import { Habit } from '../types';
import { Trash2, Plus, Smile, Droplets, Activity, Moon, Carrot, Tv, Monitor, Heart, Hexagon, Sun, Book, Music, Coffee, Gamepad2, Utensils } from 'lucide-react';

interface HabitSettingsProps {
  habits: Habit[];
  onAddHabit: (name: string, iconKey: string) => void;
  onDeleteHabit: (id: string) => void;
}

const ICON_OPTIONS = [
  { key: 'smile', Icon: Smile },
  { key: 'droplet', Icon: Droplets },
  { key: 'activity', Icon: Activity },
  { key: 'moon', Icon: Moon },
  { key: 'sun', Icon: Sun },
  { key: 'carrot', Icon: Carrot },
  { key: 'tv-off', Icon: Tv },
  { key: 'monitor', Icon: Monitor },
  { key: 'heart', Icon: Heart },
  { key: 'book', Icon: Book },
  { key: 'music', Icon: Music },
  { key: 'coffee', Icon: Coffee },
  { key: 'game', Icon: Gamepad2 },
  { key: 'food', Icon: Utensils },
];

// Helper to get icon component
const getIcon = (key: string) => {
  const opt = ICON_OPTIONS.find(o => o.key === key);
  return opt ? opt.Icon : Hexagon;
};

export const HabitSettings: React.FC<HabitSettingsProps> = ({ habits, onAddHabit, onDeleteHabit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('smile');

  const handleAdd = () => {
    if (newName.trim()) {
      onAddHabit(newName, selectedIcon);
      setNewName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-panel h-full rounded-3xl p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 z-10">
        <h2 className="text-2xl font-display font-bold text-gray-800">Habit Lab</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          New Habit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-3">
          {habits.map(habit => {
            const Icon = getIcon(habit.iconKey);
            return (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-white/50 border border-white rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-gray-700">{habit.name}</span>
                </div>
                <button 
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal / Overlay */}
      {isAdding && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xl flex flex-col p-8 animate-in slide-in-from-bottom-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Habit</h3>
          
          <input
            type="text"
            placeholder="Habit Name (e.g. Read 15 mins)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-green-500 focus:outline-none mb-6"
          />

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-3">Select Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedIcon(opt.key)}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === opt.key 
                      ? 'bg-green-500 text-white shadow-md transform scale-105' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <opt.Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <button 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
            >
              Cancel
            </button>
            <button 
              onClick={handleAdd}
              className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold shadow-lg shadow-green-200"
            >
              Save Habit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
