import React, { useState } from 'react';
import { Wallet, TrendingUp, Sparkles, Award, QrCode, History, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
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
  const [showLedger, setShowLedger] = useState(false);
  const plan = profile.activePlan;
  const currentBalance = plan?.currentBalance || 0;
  const totalContributed = plan?.totalPrincipalContributed || 0;
  const totalInterest = plan?.totalInterestEarned || 0;
  const totalMatch = plan?.totalBonusesEarned || 0;

  const targetMonths = plan?.targetTermMonths || profile.simulationParams.termMonths || 6;
  const completedMonths = plan
    ? Math.min(targetMonths, Math.floor(plan.transactions.filter((t) => t.type === 'DEPOSIT').length))
    : 0;
  const progressPercent = Math.min(100, Math.round((completedMonths / targetMonths) * 100));

  const parentTitle = profile.parentName || 'Parent';
  const interestRate = profile.simulationParams.annualInterestRate || 30;
  const matchPercent = (profile.simulationParams.parentInterestMatchMultiplier || 1) * 100;

  const handleGrowthClick = async () => {
    await hapticsService.impactMedium();
    onOpenGrowthLab();
  };

  const handleToggleLedger = async () => {
    await hapticsService.impactLight();
    setShowLedger(!showLedger);
  };

  return (
    <div className="space-y-3 pb-20 animate-in fade-in duration-300 select-none">
      {/* Hero Vault Balance Card (Apple Obsidian Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900/90 border border-white/10 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">{profile.avatarEmoji || '🚀'}</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 block">
                {profile.teenName}'s Vault
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {plan && completedMonths > 0 ? `Month ${completedMonths} of ${targetMonths}` : '⚡ Ready to Launch'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenPairing}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl text-xs font-bold text-zinc-200 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Pair</span>
          </button>
        </div>

        {/* Big High-Contrast Balance */}
        <div className="mt-3 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            Current Vault Balance
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-sm">
            {formatCurrency(currentBalance, currency)}
          </div>
          <p className="text-xs font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{interestRate}% Bank of {parentTitle} Yield Active</span>
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1 relative z-10">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-zinc-400">Lock-in Progress</span>
            <span className="text-amber-400 font-mono text-xs">{completedMonths} / {targetMonths} Mo ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real-time Ledger Pillars Card */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Projected Maturity Payout ({targetMonths} Mo)
            </h3>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 inline-block">
              {simulation.snowballFactor}x Velocity
            </span>
          </div>
        </div>

        {/* 4-Pillar Stat Tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-950/70 border border-white/5 p-2.5 rounded-2xl space-y-0.5">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-bold">
              <Wallet className="w-3.5 h-3.5 text-zinc-400" />
              <span>Contributed Principal</span>
            </div>
            <div className="text-sm font-black text-white font-mono">
              {formatCurrency(totalContributed, currency)}
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-white/5 p-2.5 rounded-2xl space-y-0.5">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Yield Earned</span>
            </div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              +{formatCurrency(totalInterest, currency)}
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-white/5 p-2.5 rounded-2xl space-y-0.5">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{parentTitle} {matchPercent}% Match</span>
            </div>
            <div className="text-sm font-black text-amber-300 font-mono">
              +{formatCurrency(totalMatch, currency)}
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-white/5 p-2.5 rounded-2xl space-y-0.5">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-bold">
              <Award className="w-3.5 h-3.5 text-zinc-300" />
              <span>Target Bonus</span>
            </div>
            <div className="text-sm font-black text-zinc-200 font-mono">
              +{formatCurrency(simulation.completionBonus, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Kid's Transparent Ledger Access */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-3 shadow-sm space-y-2">
        <button
          onClick={handleToggleLedger}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 cursor-pointer p-1"
        >
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-zinc-400" />
            <span>My Verified Ledger ({plan?.transactions?.length || 0} Entries)</span>
          </div>
          {showLedger ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {showLedger && (
          <div className="space-y-1.5 pt-1 border-t border-white/5 max-h-48 overflow-y-auto pr-1">
            {plan?.transactions && plan.transactions.length > 0 ? (
              plan.transactions.slice(-6).reverse().map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-white/5 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block text-[11px]">{tx.notes || tx.type}</span>
                    <span className="text-[9px] text-zinc-400">{new Date(tx.date).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-xs">
                    +{formatCurrencyExact(tx.amount, currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-zinc-400 py-1.5 text-center">No transactions recorded yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Growth Accelerator Button */}
      <button
        onClick={handleGrowthClick}
        className="w-full py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer"
      >
        <span>Open Interactive Growth Lab</span>
        <ArrowUpRight className="w-4 h-4 text-zinc-950" />
      </button>
    </div>
  );
};
