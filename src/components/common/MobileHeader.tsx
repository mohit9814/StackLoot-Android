import React from 'react';
import { Coins, Sparkles, Trophy, Globe } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig } from '../../types/allowance';
import type { AppUserRole } from '../../types/pairing';
import { formatCurrency } from '../../config/currencies';

interface MobileHeaderProps {
  profile: UserProfile;
  currency: CurrencyConfig;
  userRole: AppUserRole;
  onOpenProfilePicker: () => void;
  onOpenCurrencyPicker: () => void;
  onOpenRolePicker: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  profile,
  currency,
  userRole,
  onOpenProfilePicker,
  onOpenCurrencyPicker,
  onOpenRolePicker,
}) => {
  const currentBalance = profile.activePlan?.currentBalance || 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/80 px-4 py-3 pt-safe">
      <div className="flex items-center justify-between">
        {/* Brand & Profile Picker */}
        <button
          onClick={onOpenProfilePicker}
          className="flex items-center gap-2.5 active:scale-95 transition-transform text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white/15 text-xl">
            {profile.avatarEmoji || <Coins className="w-5 h-5 text-amber-300" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-white tracking-tight bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                StackLoot
              </h1>
              <span className="text-[11px] bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 font-bold px-2 py-0.5 rounded-lg">
                {profile.teenName}
              </span>
            </div>
            <p className="text-xs font-mono text-emerald-400 font-extrabold">
              {formatCurrency(currentBalance, currency)} in Vault
            </p>
          </div>
        </button>

        {/* Global Currency, Role & XP Badges */}
        <div className="flex items-center gap-1.5">
          {/* Role Mode Pill */}
          <button
            onClick={onOpenRolePicker}
            className="flex items-center gap-1 bg-indigo-950/80 border border-indigo-600/40 hover:border-indigo-500 px-2 py-1.5 rounded-xl text-xs font-bold text-indigo-300 active:scale-95 transition-all cursor-pointer"
          >
            <span>{userRole === 'PARENT' ? '👨‍👧 Parent' : '🚀 Teen'}</span>
          </button>

          {/* Currency Pill */}
          <button
            onClick={onOpenCurrencyPicker}
            className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currency.code}</span>
          </button>

          {/* Level & XP */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl shadow-inner">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
              <Trophy className="w-3.5 h-3.5" />
              <span>Lvl {profile.gamification.currentLevel}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{profile.gamification.totalXp}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
