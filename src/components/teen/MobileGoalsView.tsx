import React from 'react';
import { Target, Plus, CheckCircle, Zap, Calendar } from 'lucide-react';
import type { SavingsGoal } from '../../types/goal';
import type { CurrencyConfig, SimulationParams } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { predictGoalAffordability } from '../../services/goalPredictor';
import { hapticsService } from '../../services/hapticsService';

interface MobileGoalsViewProps {
  goals: SavingsGoal[];
  vaultBalance: number;
  currency: CurrencyConfig;
  simulationParams: SimulationParams;
  onOpenAddGoal: () => void;
  onOpenTasks: () => void;
}

export const MobileGoalsView: React.FC<MobileGoalsViewProps> = ({
  goals,
  vaultBalance,
  currency,
  simulationParams,
  onOpenAddGoal,
  onOpenTasks,
}) => {
  const handleAddClick = async () => {
    await hapticsService.impactLight();
    onOpenAddGoal();
  };

  return (
    <div className="space-y-3 pb-20 animate-in fade-in duration-300 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-900 border border-white/10 text-amber-400 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Wishlist & Aspirations</h2>
            <p className="text-[11px] text-zinc-400">Compounding timeline & afford forecast</p>
          </div>
        </div>
        <button
          onClick={handleAddClick}
          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl flex items-center gap-1 text-xs font-black active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((vaultBalance / goal.targetAmount) * 100));
          const isFunded = vaultBalance >= goal.targetAmount;
          const forecast = predictGoalAffordability(goal.targetAmount, vaultBalance, simulationParams);

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-3xl border transition-all ${
                isFunded
                  ? 'bg-zinc-900 border-emerald-500/30'
                  : 'bg-zinc-900/90 border-white/10 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-black text-white">{goal.title}</h4>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {goal.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black font-mono text-amber-400 block">
                    {formatCurrency(goal.targetAmount, currency)}
                  </span>
                  {isFunded && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-black justify-end mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 mt-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                  <span>Vault Progress</span>
                  <span className={isFunded ? 'text-emerald-400 font-black' : 'text-zinc-200'}>
                    {progress}% ({formatCurrency(vaultBalance, currency)} saved)
                  </span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFunded ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.max(4, progress)}%` }}
                  />
                </div>
              </div>

              {/* Predictive Timeline Box */}
              {!isFunded && (
                <div className="mt-3 p-2.5 bg-zinc-950 border border-white/5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Affordable In:</span>
                    </span>
                    <span className="font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded-lg border border-white/10">
                      {forecast.monthsNeeded} Months ({forecast.targetDate})
                    </span>
                  </div>

                  {forecast.monthsSavedByChores > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                      <span className="flex items-center gap-1 text-amber-300 font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Complete chores:</span>
                      </span>
                      <button
                        onClick={onOpenTasks}
                        className="font-black text-amber-400 hover:underline cursor-pointer"
                      >
                        ⚡ Afford {forecast.monthsSavedByChores} Mo Earlier!
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
