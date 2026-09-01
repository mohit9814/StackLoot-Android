import React from 'react';
import { Coins, Sparkles, Trophy } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';

interface MobileHeaderProps {
  profile: UserProfile;
  currency: CurrencyConfig;
  onOpenProfilePicker: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  profile,
  currency,
  onOpenProfilePicker,
}) => {
  const currentBalance = profile.activePlan?.currentBalance || 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 pt-safe">
      <div className="flex items-center justify-between">
        {/* Brand & Profile Picker */}
        <button
          onClick={onOpenProfilePicker}
          className="flex items-center gap-2.5 active:scale-95 transition-transform text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20 text-base">
            {profile.avatarEmoji || <Coins className="w-5 h-5 text-amber-300" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-white tracking-tight bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                StackLoot
              </h1>
              <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-bold px-1.5 py-0.2 rounded-md">
                {profile.teenName}
              </span>
            </div>
            <p className="text-[11px] font-mono text-emerald-400 font-bold">
              {formatCurrency(currentBalance, currency)} in Vault
            </p>
          </div>
        </button>

        {/* Level & XP */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl shadow-inner">
          <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
            <Trophy className="w-3.5 h-3.5" />
            <span>Lvl {profile.gamification.currentLevel}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{profile.gamification.totalXp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
