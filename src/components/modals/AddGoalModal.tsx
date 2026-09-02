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
  { id: 'TECH', label: 'Gadget / Device', icon: '💻' },
  { id: 'GAMING', label: 'Gaming / Console', icon: '🎮' },
  { id: 'EXPERIENCE', label: 'Trip / Event', icon: '🎟️' },
  { id: 'OTHER', label: 'Special Dream', icon: '⭐' },
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  currency,
  onAddGoal,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<GoalCategory>('TECH');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    await hapticsService.notifySuccess();
    onAddGoal({
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount: Number(amount),
      category,
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Add Dream Wishlist Goal</h3>
              <p className="text-[11px] text-zinc-400">Set item name & target price</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Goal Name</label>
            <input
              type="text"
              placeholder="e.g. PlayStation 5, AirPods Pro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Target Cost ({currency.symbol})</label>
            <input
              type="number"
              min={100}
              step={100}
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-amber-400/10 border-amber-400 font-bold text-white'
                      : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer mt-1"
          >
            <Plus className="w-4 h-4 text-zinc-950" />
            <span>Create Dream Goal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
