import React from 'react';
import { Wallet, TrendingUp, Sparkles, Award, Snowflake, Flame } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig, SimulationResult } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';

interface MobileVaultViewProps {
  profile: UserProfile;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  onOpenGrowthLab: () => void;
}

export const MobileVaultView: React.FC<MobileVaultViewProps> = ({
  profile,
  simulation,
  currency,
  onOpenGrowthLab,
}) => {
  const plan = profile.activePlan;
  const currentBalance = plan?.currentBalance || 0;
  const targetMonths = plan?.targetTermMonths || profile.simulationParams.termMonths || 6;
  const completedMonths = plan
    ? Math.min(targetMonths, Math.floor(plan.transactions.filter(t => t.type === 'DEPOSIT').length))
    : 0;
  const progressPercent = Math.min(100, Math.round((completedMonths / targetMonths) * 100));

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Vault Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            {profile.teenName}'s Active Vault
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/40">
            {plan ? '🔒 Locked & Compounding' : '⚡ Ready to Launch'}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {formatCurrency(currentBalance, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {plan ? `Target Term: ${completedMonths} of ${targetMonths} Months Completed` : 'Tap Growth Lab to test rewards'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-300">Lock-in Progress</span>
            <span className="text-emerald-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4-Pillar Transparent Payout Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projected Snowball Payout
            </h3>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </div>
          </div>
          <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-600/40">
            {simulation.snowballFactor}x Velocity
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              <span>Principal Saved ({targetMonths} mo):</span>
            </span>
            <span className="font-mono font-bold text-white">
              {formatCurrency(simulation.totalPrincipalSaved, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bank of Dad Yield (30% p.a.):</span>
            </span>
            <span className="font-mono font-bold text-emerald-400">
              +{formatCurrencyExact(simulation.totalInterestEarned, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-purple-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Dad's Match Bonus (100%):</span>
            </span>
            <span className="font-mono font-bold text-purple-300">
              +{formatCurrencyExact(simulation.totalParentInterestMatch, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-amber-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Milestone Kicker (+20%):</span>
            </span>
            <span className="font-mono font-bold text-amber-300">
              +{formatCurrency(simulation.completionBonus, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Snowball Velocity Spotlight */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Monthly Earning Velocity
          </span>
          <Snowflake className="w-4 h-4 text-amber-400 animate-spin-slow" />
        </div>
        <div className="text-xl font-black text-white font-mono">
          {simulation.snowballFactor}x Faster by Month {targetMonths}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In Month 1, your deposit earns <strong>₹25.00/mo</strong>. By Month {targetMonths}, your money works <strong>{simulation.snowballFactor}x faster</strong> earning <strong>₹159.69/mo</strong>!
        </p>
        <button
          onClick={onOpenGrowthLab}
          className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 active:scale-98 text-slate-950 font-black text-xs rounded-2xl transition-transform flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Flame className="w-4 h-4" />
          <span>Open Interactive Growth Lab</span>
        </button>
      </div>
    </div>
  );
};
