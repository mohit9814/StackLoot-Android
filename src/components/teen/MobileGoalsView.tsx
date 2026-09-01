import React from 'react';
import { Target, Plus, CheckCircle } from 'lucide-react';
import type { SavingsGoal } from '../../types/goal';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';

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
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Wishlist Goals</h2>
            <p className="text-xs text-slate-400">What you are compounding for</p>
          </div>
        </div>
        <button
          onClick={onOpenAddGoal}
          className="p-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1 text-xs font-bold active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add</span>
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
              className={`p-4 rounded-3xl border transition-all ${
                isFunded
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{goal.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black font-mono text-amber-400">
                    {formatCurrency(goal.targetAmount, currency)}
                  </span>
                  {isFunded && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold justify-end">
                      <CheckCircle className="w-3 h-3" />
                      <span>Funded!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1 mt-3">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Vault Progress</span>
                  <span className={isFunded ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFunded ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-amber-400'
                    }`}
                    style={{ width: `${progress}%` }}
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
