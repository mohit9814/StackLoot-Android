import React, { useState } from 'react';
import { Target, X, Plus } from 'lucide-react';
import type { GoalCategory, SavingsGoal } from '../../types/goal';
import type { CurrencyConfig } from '../../types/allowance';
import { hapticsService } from '../../services/hapticsService';

interface AddGoalModalProps {
  isOpen: boolean;
  currency: CurrencyConfig;
  onAddGoal: (goal: SavingsGoal) => void;
  onClose: () => void;
}

const CATEGORIES: { id: GoalCategory; label: string; icon: string }[] = [
  { id: 'TECH', label: 'Tech & Gadgets', icon: '💻' },
  { id: 'GAMING', label: 'Gaming / Console', icon: '🎮' },
  { id: 'MUSIC', label: 'Music & Instruments', icon: '🎸' },
  { id: 'EXPERIENCE', label: 'Trips & Events', icon: '🎟️' },
  { id: 'EDUCATION', label: 'Learning & Books', icon: '📚' },
  { id: 'OTHER', label: 'Other Aspiration', icon: '⭐' },
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  currency,
  onAddGoal,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('10000');
  const [category, setCategory] = useState<GoalCategory>('TECH');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || Number(targetAmount) <= 0) return;

    await hapticsService.notifySuccess();
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount: Number(targetAmount),
      category,
      createdAt: new Date().toISOString(),
    };

    onAddGoal(newGoal);
    onClose();
    setTitle('');
    setTargetAmount('10000');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Savings Goal</h3>
              <p className="text-xs text-slate-400">Set a target reward to compound towards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Goal Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Goal Name</label>
            <input
              type="text"
              placeholder="e.g. Sony WH-CH720N or RTX GPU"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Target Cost ({currency.symbol})</label>
            <input
              type="number"
              min={100}
              step={100}
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Category Picker */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all text-xs ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/40 text-slate-300'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-black text-xs rounded-2xl active:scale-98 transition-transform flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal to Vault</span>
          </button>
        </form>
      </div>
    </div>
  );
};
