import React from 'react';
import { ShieldCheck, Plus, History, QrCode, Sparkles } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';
import { notificationService } from '../../services/notificationService';
import { confettiService } from '../../services/confettiService';

interface MobileParentStudioProps {
  profile: UserProfile;
  currency: CurrencyConfig;
  onUpdatePlan: (profile: UserProfile) => void;
  onLockSession: () => void;
  onOpenPairing: () => void;
  onLogActivity?: (title: string, desc: string, amount: number) => void;
}

export const MobileParentStudio: React.FC<MobileParentStudioProps> = ({
  profile,
  currency,
  onUpdatePlan,
  onLockSession,
  onOpenPairing,
  onLogActivity,
}) => {
  const plan = profile.activePlan;
  const allowanceAmount = profile.simulationParams.monthlyAllowance;
  const annualRate = profile.simulationParams.annualInterestRate || 30;
  const monthlyRate = (annualRate / 100) / 12;
  const matchMultiplier = profile.simulationParams.parentInterestMatchMultiplier || 1;

  const currentBalance = plan?.currentBalance || 0;
  const totalContributed = plan?.totalPrincipalContributed || 0;
  const totalInterest = plan?.totalInterestEarned || 0;
  const totalMatch = plan?.totalBonusesEarned || 0;
  const currentMonthCycle = (plan?.transactions.filter((t) => t.type === 'DEPOSIT').length || 0) + 1;

  const handleMonthlyDeposit = async () => {
    await hapticsService.impactHeavy();
    confettiService.fireCelebration();

    const nowIso = new Date().toISOString();
    const addedDeposit = allowanceAmount;
    const balanceBeforeInterest = currentBalance + addedDeposit;
    const monthlyInterest = balanceBeforeInterest * monthlyRate;
    const monthlyMatch = monthlyInterest * matchMultiplier;
    const newEndingBalance = balanceBeforeInterest + monthlyInterest + monthlyMatch;

    const newTxs = [
      ...(plan?.transactions || []),
      {
        id: `tx-${Date.now()}-dep`,
        date: nowIso,
        monthIndex: currentMonthCycle,
        type: 'DEPOSIT' as const,
        amount: addedDeposit,
        balanceAfter: currentBalance + addedDeposit,
        notes: `Month ${currentMonthCycle} Allowance`,
      },
      {
        id: `tx-${Date.now()}-int`,
        date: nowIso,
        monthIndex: currentMonthCycle,
        type: 'INTEREST_CREDIT' as const,
        amount: monthlyInterest,
        balanceAfter: balanceBeforeInterest + monthlyInterest,
        notes: `Month ${currentMonthCycle} Yield (${annualRate}% p.a.)`,
      },
      {
        id: `tx-${Date.now()}-match`,
        date: nowIso,
        monthIndex: currentMonthCycle,
        type: 'BONUS_MATCH' as const,
        amount: monthlyMatch,
        balanceAfter: newEndingBalance,
        notes: `${profile.parentName}'s ${matchMultiplier * 100}% Match`,
      },
    ];

    const updatedProfile: UserProfile = {
      ...profile,
      activePlan: {
        ...(plan || {
          planId: `plan-${Date.now()}`,
          teenName: profile.teenName,
          parentName: profile.parentName,
          startDate: nowIso,
          targetTermMonths: profile.simulationParams.termMonths,
          monthlyAllowance: allowanceAmount,
          deferralPercentage: 100,
          annualInterestRate: annualRate,
          completionBonusPercentage: 20,
          parentInterestMatchMultiplier: matchMultiplier,
          initialLumpSumDeposit: 0,
          status: 'ACTIVE',
        }),
        currentBalance: newEndingBalance,
        totalPrincipalContributed: totalContributed + addedDeposit,
        totalInterestEarned: totalInterest + monthlyInterest,
        totalBonusesEarned: totalMatch + monthlyMatch,
        transactions: newTxs,
      },
      updatedAt: nowIso,
    };

    onUpdatePlan(updatedProfile);

    if (onLogActivity) {
      onLogActivity(
        `Month ${currentMonthCycle} Progressed`,
        `Credited ${formatCurrency(addedDeposit, currency)} + ${formatCurrencyExact(monthlyInterest + monthlyMatch, currency)} yield & match`,
        addedDeposit + monthlyInterest + monthlyMatch
      );
    }

    await notificationService.scheduleMonthlyDividendAlert(
      profile.teenName,
      formatCurrencyExact(monthlyInterest + monthlyMatch, currency)
    );
  };

  return (
    <div className="space-y-3 pb-20 animate-in fade-in duration-300 select-none">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-900 border border-white/10 text-amber-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Parent Studio OS</h2>
            <p className="text-[11px] text-zinc-400">Rules & payout for {profile.teenName}</p>
          </div>
        </div>

        <button
          onClick={onLockSession}
          className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-bold active:scale-95 cursor-pointer hover:bg-zinc-800"
        >
          Lock
        </button>
      </div>

      {/* Pair Child Phone Banner */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-800 text-amber-400 rounded-lg">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Pair {profile.teenName}'s Phone</h4>
            <p className="text-[10px] text-zinc-400">Show QR code or 6-digit invite code</p>
          </div>
        </div>
        <button
          onClick={onOpenPairing}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Show QR
        </button>
      </div>

      {/* Instant Month Progress Action */}
      <div className="bg-zinc-900/95 border border-white/10 rounded-3xl p-4 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Cycle Control (Month {currentMonthCycle})</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
            {annualRate}% Yield Active
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-snug">
          Progress 1 month: Credits <strong>{formatCurrency(allowanceAmount, currency)}</strong> + <strong>{annualRate}% yield</strong> + <strong>{matchMultiplier * 100}% {profile.parentName} match</strong>.
        </p>

        <button
          onClick={handleMonthlyDeposit}
          className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>Progress Month {currentMonthCycle} (Credit Vault)</span>
        </button>
      </div>

      {/* Audit Transaction History */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <History className="w-4 h-4 text-zinc-400" />
          <span>Vault Transaction Ledger</span>
        </div>

        {plan?.transactions && plan.transactions.length > 0 ? (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {plan.transactions.slice(-6).reverse().map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-white/5 text-xs"
              >
                <div>
                  <span className="font-bold text-white block text-[11px]">{tx.notes || tx.type}</span>
                  <span className="text-[9px] text-zinc-400">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-xs">
                  +{formatCurrencyExact(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400 py-2 text-center">No transactions recorded yet. Start by progressing Month 1 above!</p>
        )}
      </div>
    </div>
  );
};
