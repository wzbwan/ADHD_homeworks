
import React, { useState } from 'react';
import { Task, TaskType, TaskStatus } from '../types';
import { Star, CheckCircle2, Circle, Plus, ListPlus, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  todayDate: string;
  onCompleteTask: (taskId: string, stars: number) => void;
  onAddNewClick: () => void;
  onAddFromListClick: () => void;
  onDeleteTask: (taskId: string) => void;
}

const InteractiveStarRating: React.FC<{ 
  earned: number; 
  max: number; 
  status: TaskStatus;
  onRate?: (stars: number) => void;
}> = ({ earned, max, status, onRate }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isCompleted = status === TaskStatus.COMPLETED;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverIndex(null)}>
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = isCompleted ? i < earned : (hoverIndex !== null && i <= hoverIndex);
        return (
          <button
            key={i}
            disabled={isCompleted}
            onMouseEnter={() => !isCompleted && setHoverIndex(i)}
            onClick={() => !isCompleted && onRate && onRate(i + 1)}
            className={`transition-transform duration-200 ${!isCompleted ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              size={20}
              className={`transition-colors duration-300 ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

const TaskItem: React.FC<{ 
  task: Task; 
  onComplete: (stars: number) => void;
  onDelete: () => void;
}> = ({ task, onComplete, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
        ) : (
          <Circle className="text-gray-300 w-5 h-5 shrink-0" />
        )}
        <span className={`text-base font-medium transition-all duration-300 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <InteractiveStarRating 
          earned={task.starsEarned} 
          max={task.maxStars} 
          status={task.status} 
          onRate={onComplete}
        />
        <button 
          onClick={onDelete}
          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  todayDate, 
  onCompleteTask, 
  onAddNewClick,
  onAddFromListClick,
  onDeleteTask
}) => {
  const mandatoryTasks = tasks.filter(t => t.type === TaskType.MANDATORY);
  const optionalTasks = tasks.filter(t => t.type === TaskType.OPTIONAL);

  return (
    <div className="glass-panel h-full rounded-3xl p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex flex-col mb-6 relative z-10">
        <span className="text-2xl font-display font-bold text-gray-800">{todayDate}</span>
        <div className="flex justify-between items-end mt-2">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Missions</span>
          <div className="flex gap-2">
             <button 
                onClick={onAddFromListClick}
                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-bold"
             >
                <ListPlus size={16} />
                List
             </button>
             <button 
                onClick={onAddNewClick}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 text-xs font-bold shadow-md shadow-indigo-200"
             >
                <Plus size={16} />
                New
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
        <div>
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 bg-indigo-50 inline-block px-2 py-1 rounded">Must Do</h3>
          <div className="flex flex-col gap-1">
            {mandatoryTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onComplete={(stars) => onCompleteTask(task.id, stars)} 
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {mandatoryTasks.length === 0 && <p className="text-gray-400 italic text-sm py-2">No mandatory tasks set.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-3 bg-pink-50 inline-block px-2 py-1 rounded">Bonus Missions</h3>
          <div className="flex flex-col gap-1">
            {optionalTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onComplete={(stars) => onCompleteTask(task.id, stars)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {optionalTasks.length === 0 && <p className="text-gray-400 italic text-sm py-2">No optional tasks added.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
