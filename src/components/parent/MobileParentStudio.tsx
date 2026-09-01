import React from 'react';
import { ShieldCheck, Plus, History, Sparkles } from 'lucide-react';
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
}

export const MobileParentStudio: React.FC<MobileParentStudioProps> = ({
  profile,
  currency,
  onUpdatePlan,
  onLockSession,
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
    const nextMonthIndex = currentTxs.filter(t => t.type === 'DEPOSIT').length + 1;
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
        notes: `Month ${nextMonthIndex} Deferred Allowance`,
      },
      {
        id: `tx-${Date.now()}-int`,
        date: nowIso,
        monthIndex: nextMonthIndex,
        type: 'INTEREST_CREDIT' as const,
        amount: monthlyInterest,
        balanceAfter: currentBalance + addedDeposit + monthlyInterest,
        notes: `Month ${nextMonthIndex} Compounding Yield (30% p.a.)`,
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
    <div className="space-y-4 pb-20">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Parent Studio OS</h2>
            <p className="text-xs text-slate-400">Admin controls for {profile.teenName}'s plan</p>
          </div>
        </div>
        <button
          onClick={onLockSession}
          className="p-2 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold active:scale-95"
        >
          Lock Studio
        </button>
      </div>

      {/* Quick Action: Credit Month's Allowance & Compounding */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 uppercase">Monthly Cycle Action</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-xs text-slate-300">
          Deposit this month's deferred allowance ({formatCurrency(allowanceAmount, currency)}) and credit compounding yield + Dad's 100% match.
        </p>
        <button
          onClick={handleMonthlyDeposit}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-black text-sm rounded-2xl active:scale-98 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Credit Next Month (+Send Push Alert)</span>
        </button>
      </div>

      {/* Audit Transaction History */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
          <History className="w-4 h-4 text-slate-400" />
          <span>Recent Ledger Transactions</span>
        </div>

        {plan?.transactions && plan.transactions.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {plan.transactions.slice(-6).reverse().map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{tx.notes || tx.type}</span>
                  <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatCurrencyExact(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No transactions recorded yet.</p>
        )}
      </div>
    </div>
  );
};
