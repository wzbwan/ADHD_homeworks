import React from 'react';
import { Task, TaskType, TaskStatus } from '../types';
import { Star, CheckCircle2, Circle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  todayDate: string;
}

const StarRating: React.FC<{ earned: number; max: number; status: TaskStatus }> = ({ earned, max, status }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={20}
          className={`transition-all duration-500 ${
            status === TaskStatus.COMPLETED && i < earned
              ? 'fill-yellow-400 text-yellow-400 scale-110'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
        ) : (
          <Circle className="text-gray-300 w-5 h-5 shrink-0" />
        )}
        <span className={`text-base font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {task.title}
        </span>
      </div>
      <StarRating earned={task.starsEarned} max={task.maxStars} status={task.status} />
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, todayDate }) => {
  const mandatoryTasks = tasks.filter(t => t.type === TaskType.MANDATORY);
  const optionalTasks = tasks.filter(t => t.type === TaskType.OPTIONAL);

  return (
    <div className="glass-panel h-full rounded-3xl p-8 flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-end mb-8 relative z-10">
        <h2 className="text-2xl font-display font-bold text-gray-800">Mission Board</h2>
        <span className="text-sm font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{todayDate}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4">Must Do</h3>
          <div className="flex flex-col gap-1">
            {mandatoryTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
            {mandatoryTasks.length === 0 && <p className="text-gray-400 italic text-sm">No mandatory tasks.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4">Bonus Missions</h3>
          <div className="flex flex-col gap-1">
            {optionalTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
            {optionalTasks.length === 0 && <p className="text-gray-400 italic text-sm">No optional tasks.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
