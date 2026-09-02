import React from 'react';
import { Wallet, TrendingUp, Sparkles, Award, Snowflake, Flame, QrCode } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig, SimulationResult } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';

interface MobileVaultViewProps {
  profile: UserProfile;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  onOpenGrowthLab: () => void;
  onOpenPairing: () => void;
}

export const MobileVaultView: React.FC<MobileVaultViewProps> = ({
  profile,
  simulation,
  currency,
  onOpenGrowthLab,
  onOpenPairing,
}) => {
  const plan = profile.activePlan;
  const currentBalance = plan?.currentBalance || 0;
  const targetMonths = plan?.targetTermMonths || profile.simulationParams.termMonths || 6;
  const completedMonths = plan
    ? Math.min(targetMonths, Math.floor(plan.transactions.filter((t) => t.type === 'DEPOSIT').length))
    : 0;
  const progressPercent = Math.min(100, Math.round((completedMonths / targetMonths) * 100));

  const handleGrowthClick = async () => {
    await hapticsService.impactMedium();
    onOpenGrowthLab();
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Hero Vault Balance Card (High Impact & Animated Glow) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/40 p-6 shadow-2xl shadow-indigo-950/50">
        {/* Shimmer Background Accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{profile.avatarEmoji || '🚀'}</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300 block">
                {profile.teenName}'s Vault
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {plan ? '🔒 Compounding Active' : '⚡ Ready to Launch'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenPairing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/40 rounded-xl text-xs font-bold text-indigo-200 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Pair</span>
          </button>
        </div>

        {/* Big Bold Balance */}
        <div className="mt-5 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Vault Balance
          </span>
          <div className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md">
            {formatCurrency(currentBalance, currency)}
          </div>
          <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>+30% Bank of Dad Yield Active</span>
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Lock-in Progress</span>
            <span className="text-amber-400 font-mono text-sm">{completedMonths} / {targetMonths} Months ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Projected 6-Month Snowball Payout Banner */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projected Maturity Payout
            </h3>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black font-mono text-amber-400 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/50 inline-block shadow-sm">
              ⚡ {simulation.snowballFactor}x Velocity
            </span>
          </div>
        </div>

        {/* 4-Pillar Large Stat Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span>Saved Principal</span>
            </div>
            <div className="text-base font-black text-white font-mono">
              {formatCurrency(simulation.totalPrincipalSaved, currency)}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>30% Dad Yield</span>
            </div>
            <div className="text-base font-black text-emerald-400 font-mono">
              +{formatCurrency(simulation.totalInterestEarned, currency)}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Dad's 100% Match</span>
            </div>
            <div className="text-base font-black text-purple-300 font-mono">
              +{formatCurrency(simulation.totalParentInterestMatch, currency)}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Milestone Bonus</span>
            </div>
            <div className="text-base font-black text-amber-400 font-mono">
              +{formatCurrency(simulation.completionBonus, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Earning Accelerator CTA */}
      <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <h4 className="text-sm font-black text-white">Monthly Compounding Velocity</h4>
          </div>
          <span className="text-xs font-bold text-amber-400 font-mono">
            {simulation.snowballFactor}x Faster
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          In Month 1, your deposit earns <strong>{formatCurrencyExact(simulation.breakdown[0]?.interestEarned || 25, currency)}/mo</strong>. By Month {targetMonths}, your money works <strong>{simulation.snowballFactor}x faster</strong> earning <strong>{formatCurrencyExact(simulation.breakdown[targetMonths - 1]?.interestEarned || 159.69, currency)}/mo</strong>!
        </p>

        <button
          onClick={handleGrowthClick}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 active:scale-95 text-slate-950 font-black text-sm rounded-2xl transition-transform flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Flame className="w-5 h-5 text-slate-950" />
          <span>Launch Interactive Growth Lab</span>
        </button>
      </div>
    </div>
  );
};
