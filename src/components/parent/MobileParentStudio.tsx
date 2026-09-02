import React from 'react';
import { ShieldCheck, Plus, History, Sparkles, QrCode } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { notificationService } from '../../services/notificationService';
import { hapticsService } from '../../services/hapticsService';

interface MobileParentStudioProps {
  profile: UserProfile;
  currency: CurrencyConfig;
  onUpdatePlan: (updatedProfile: UserProfile) => void;
  onLockSession: () => void;
  onOpenPairing: () => void;
}

export const MobileParentStudio: React.FC<MobileParentStudioProps> = ({
  profile,
  currency,
  onUpdatePlan,
  onLockSession,
  onOpenPairing,
}) => {
  const allowanceAmount = profile.simulationParams.monthlyAllowance;
  const plan = profile.activePlan;
  const currentBalance = plan?.currentBalance || 0;

  // Quick Monthly Deposit Trigger
  const handleMonthlyDeposit = async () => {
    await hapticsService.notifySuccess();
    const monthlyRate = (profile.simulationParams.annualInterestRate / 100) / 12;
    const addedDeposit = (profile.simulationParams.monthlyAllowance * profile.simulationParams.deferralPercentage) / 100;
    const baseForInterest = currentBalance + addedDeposit;
    const monthlyInterest = baseForInterest * monthlyRate;
    const monthlyMatch = monthlyInterest * profile.simulationParams.parentInterestMatchMultiplier;
    const newEndingBalance = baseForInterest + monthlyInterest + monthlyMatch;

    const currentTxs = plan?.transactions || [];
    const nextMonthIndex = currentTxs.filter((t) => t.type === 'DEPOSIT').length + 1;
    const nowIso = new Date().toISOString();

    const newTxs = [
      ...currentTxs,
      {
        id: `tx-${Date.now()}-dep`,
        date: nowIso,
        monthIndex: nextMonthIndex,
        type: 'DEPOSIT' as const,
        amount: addedDeposit,
        balanceAfter: currentBalance + addedDeposit,
        notes: `Month ${nextMonthIndex} Allowance Deposit`,
      },
      {
        id: `tx-${Date.now()}-int`,
        date: nowIso,
        monthIndex: nextMonthIndex,
        type: 'INTEREST_CREDIT' as const,
        amount: monthlyInterest,
        balanceAfter: currentBalance + addedDeposit + monthlyInterest,
        notes: `Month ${nextMonthIndex} Yield (30% p.a.)`,
      },
      {
        id: `tx-${Date.now()}-match`,
        date: nowIso,
        monthIndex: nextMonthIndex,
        type: 'BONUS_MATCH' as const,
        amount: monthlyMatch,
        balanceAfter: newEndingBalance,
        notes: `Month ${nextMonthIndex} Dad 100% Match`,
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
          monthlyAllowance: profile.simulationParams.monthlyAllowance,
          deferralPercentage: profile.simulationParams.deferralPercentage,
          annualInterestRate: profile.simulationParams.annualInterestRate,
          completionBonusPercentage: profile.simulationParams.completionBonusPercentage,
          parentInterestMatchMultiplier: profile.simulationParams.parentInterestMatchMultiplier,
          initialLumpSumDeposit: 0,
          status: 'ACTIVE',
        }),
        currentBalance: newEndingBalance,
        totalPrincipalContributed: (plan?.totalPrincipalContributed || 0) + addedDeposit,
        totalInterestEarned: (plan?.totalInterestEarned || 0) + monthlyInterest,
        totalBonusesEarned: (plan?.totalBonusesEarned || 0) + monthlyMatch,
        transactions: newTxs,
      },
      gamification: {
        ...profile.gamification,
        totalXp: profile.gamification.totalXp + 150,
      },
      updatedAt: nowIso,
    };

    onUpdatePlan(updatedProfile);

    // Send push notification alert
    await notificationService.scheduleMonthlyDividendAlert(
      profile.teenName,
      formatCurrencyExact(monthlyInterest + monthlyMatch, currency)
    );
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Parent Studio OS</h2>
            <p className="text-xs text-slate-400">Rules & payout for {profile.teenName}</p>
          </div>
        </div>

        <button
          onClick={onLockSession}
          className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
        >
          Lock
        </button>
      </div>

      {/* Pair Child Phone Banner */}
      <div className="bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Pair {profile.teenName}'s Phone</h4>
            <p className="text-[11px] text-slate-400">Show QR code or 6-digit family invite</p>
          </div>
        </div>
        <button
          onClick={onOpenPairing}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
        >
          Show QR
        </button>
      </div>

      {/* Monthly Cycle Action */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">
            Monthly Cycle Credit
          </span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Credit this month's deferred allowance ({formatCurrency(allowanceAmount, currency)}) + 30% compounding yield + Dad's 100% match.
        </p>
        <button
          onClick={handleMonthlyDeposit}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 text-slate-950 font-black text-sm rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer"
        >
          <Plus className="w-5 h-5 text-slate-950" />
          <span>Credit Next Month (+Alert)</span>
        </button>
      </div>

      {/* Audit Transaction History */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <History className="w-4 h-4 text-slate-400" />
          <span>Ledger History</span>
        </div>

        {plan?.transactions && plan.transactions.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {plan.transactions.slice(-6).reverse().map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{tx.notes || tx.type}</span>
                  <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  +{formatCurrencyExact(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-2 text-center">No transactions recorded yet.</p>
        )}
      </div>
    </div>
  );
};
