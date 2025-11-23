import React, { useState } from 'react';
import { X, Minus, Plus, Gift } from 'lucide-react';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, amount: number) => void;
  maxPoints: number;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({ isOpen, onClose, onConfirm, maxPoints }) => {
  const [amount, setAmount] = useState(50);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please enter a reason');
      return;
    }
    if (amount > maxPoints) {
      setError('Not enough points!');
      return;
    }
    onConfirm(reason, amount);
    // Reset fields
    setReason('');
    setAmount(50);
    setError('');
  };

  const adjustAmount = (delta: number) => {
    setAmount(prev => Math.max(10, prev + delta));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6 text-accent">
          <Gift size={28} />
          <h2 className="text-2xl font-display font-bold text-gray-800">Redeem Prize</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">What is this for?</label>
            <input 
              type="text" 
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. 30min iPad time"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 focus:outline-none transition-colors font-medium text-gray-700"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Cost</label>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 border-2 border-gray-100">
              <button 
                onClick={() => adjustAmount(-10)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold text-indigo-600 font-display">{amount}</span>
              <button 
                onClick={() => adjustAmount(10)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
