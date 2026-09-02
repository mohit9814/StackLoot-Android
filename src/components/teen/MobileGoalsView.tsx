import React from 'react';
import { Target, Plus, CheckCircle } from 'lucide-react';
import type { SavingsGoal } from '../../types/goal';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';

interface MobileGoalsViewProps {
  goals: SavingsGoal[];
  vaultBalance: number;
  currency: CurrencyConfig;
  onOpenAddGoal: () => void;
}

export const MobileGoalsView: React.FC<MobileGoalsViewProps> = ({
  goals,
  vaultBalance,
  currency,
  onOpenAddGoal,
}) => {
  const handleAddClick = async () => {
    await hapticsService.impactLight();
    onOpenAddGoal();
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Wishlist Goals</h2>
            <p className="text-xs text-slate-400">Target rewards to compound towards</p>
          </div>
        </div>
        <button
          onClick={handleAddClick}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 rounded-xl flex items-center gap-1.5 text-xs font-black active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((vaultBalance / goal.targetAmount) * 100));
          const isFunded = vaultBalance >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-3xl border transition-all ${
                isFunded
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                  : 'bg-slate-900/95 border-slate-800 shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-base font-bold text-white">{goal.title}</h4>
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    {goal.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black font-mono text-amber-400 block">
                    {formatCurrency(goal.targetAmount, currency)}
                  </span>
                  {isFunded && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-black justify-end mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Vault Progress</span>
                  <span className={isFunded ? 'text-emerald-400 font-black' : 'text-slate-200'}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFunded ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-amber-400'
                    }`}
                    style={{ width: `${Math.max(4, progress)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
