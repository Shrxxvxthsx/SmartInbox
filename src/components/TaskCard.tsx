
import React from 'react';
import { TaskDefinition } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface TaskCardProps {
  task: TaskDefinition;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const difficultyColor = {
    easy: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    hard: 'text-rose-600 bg-rose-50 border-rose-100',
  };

  const difficultyIcon = {
    easy: <CheckCircle2 className="w-4 h-4" />,
    medium: <Zap className="w-4 h-4" />,
    hard: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-slate-900">{task.name}</h4>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
          difficultyColor[task.difficulty]
        )}>
          {difficultyIcon[task.difficulty]}
          <span className="capitalize">{task.difficulty}</span>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Goal</h5>
        <p className="text-slate-800 text-sm font-medium">
          {task.goal}
        </p>
      </div>
    </div>
  );
};
