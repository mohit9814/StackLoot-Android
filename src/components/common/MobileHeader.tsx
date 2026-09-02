import React from 'react';
import { Globe, UserCheck } from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import type { CurrencyConfig } from '../../types/allowance';
import type { AppUserRole } from '../../types/pairing';

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
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 pt-safe">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Simplified Left: Brand + Active Kid */}
        <button
          onClick={onOpenProfilePicker}
          className="flex items-center gap-2 active:scale-95 transition-transform text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 flex items-center justify-center text-base shadow-sm">
            {profile.avatarEmoji || '💎'}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white tracking-tight">StackLoot</span>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              {profile.teenName}
            </span>
          </div>
        </button>

        {/* Simplified Right: Role & Currency */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenRolePicker}
            className="flex items-center gap-1 bg-indigo-950/70 border border-indigo-500/30 hover:border-indigo-400 px-2.5 py-1 rounded-xl text-xs font-bold text-indigo-200 active:scale-95 transition-all cursor-pointer"
          >
            <UserCheck className="w-3 h-3 text-indigo-400" />
            <span>{userRole === 'PARENT' ? 'Parent' : 'Teen'}</span>
          </button>

          <button
            onClick={onOpenCurrencyPicker}
            className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded-xl text-xs font-bold text-slate-300 active:scale-95 transition-all cursor-pointer"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{currency.symbol}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
