
import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { TaskType } from '../types';
import { fetchCommonTasks, deleteCommonTask } from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewTaskModalProps extends ModalProps {
  onConfirm: (title: string, type: TaskType, isCommon: boolean) => void;
}

interface CommonTaskModalProps extends ModalProps {
  onConfirm: (titles: string[]) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.MANDATORY);
  const [isCommon, setIsCommon] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">New Mission</h2>
        
        <input
          type="text"
          placeholder="Mission Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:outline-none mb-4"
          autoFocus
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType(TaskType.MANDATORY)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
              type === TaskType.MANDATORY ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            Mandatory
          </button>
          <button
            onClick={() => setType(TaskType.OPTIONAL)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
              type === TaskType.OPTIONAL ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            Optional
          </button>
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isCommon ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}`}>
            {isCommon && <Check size={14} className="text-white" />}
          </div>
          <input type="checkbox" checked={isCommon} onChange={e => setIsCommon(e.target.checked)} className="hidden" />
          <span className="text-gray-600 text-sm font-medium">Save to common tasks</span>
        </label>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500">Cancel</button>
          <button 
            onClick={() => {
              if (title.trim()) {
                onConfirm(title, type, isCommon);
                setTitle('');
                setIsCommon(false);
              }
            }}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-indigo-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommonTaskModal: React.FC<CommonTaskModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCommonTasks().then(setTasks);
    }
  }, [isOpen]);

  const toggleSelection = (task: string) => {
    setSelected(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 flex flex-col max-h-[80vh]">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Common Missions</h2>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 space-y-2">
          {tasks.map((task, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                selected.includes(task) 
                  ? 'border-primary bg-indigo-50' 
                  : 'border-gray-100 hover:border-indigo-100'
              }`}
            >
              <button 
                onClick={() => toggleSelection(task)}
                className="flex-1 text-left flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected.includes(task) ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {selected.includes(task) && <Check size={12} className="text-white" />}
                </div>
                <span className="text-gray-700 font-medium">{task}</span>
              </button>
              <button
                onClick={async () => {
                  await deleteCommonTask(task);
                  setTasks(prev => prev.filter(t => t !== task));
                  setSelected(prev => prev.filter(t => t !== task));
                }}
                className="px-2 py-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                删除
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500">Cancel</button>
          <button 
            onClick={() => {
              onConfirm(selected);
              setSelected([]);
            }}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-indigo-200"
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
};
