import React from 'react';
import { Trophy } from 'lucide-react';

interface ScorePanelProps {
  score: number;
  onRedeemClick: () => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, onRedeemClick }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Current Score</h3>
          <div className="flex items-baseline gap-2">
             <span className="text-4xl font-display font-bold text-indigo-600">{score.toLocaleString()}</span>
             <span className="text-sm text-gray-400 font-medium">pts</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
          <Trophy size={24} fill="currentColor" />
        </div>
      </div>

      <button 
        onClick={onRedeemClick}
        className="w-full mt-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg active:translate-y-0.5"
      >
        Redeem Points
      </button>
    </div>
  );
};
