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
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-2.5 pt-safe select-none">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Minimal Left: Avatar + Title + Child Pill */}
        <button
          onClick={onOpenProfilePicker}
          className="flex items-center gap-2 active:scale-95 transition-transform text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-base shadow-sm">
            {profile.avatarEmoji || '💎'}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white tracking-tight">StackLoot</span>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
              {profile.teenName}
            </span>
          </div>
        </button>

        {/* Minimal Right: Role & Currency */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenRolePicker}
            className="flex items-center gap-1 bg-zinc-900 border border-white/10 hover:border-white/20 px-2.5 py-1 rounded-xl text-xs font-bold text-zinc-200 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <UserCheck className="w-3 h-3 text-zinc-400" />
            <span>{userRole === 'PARENT' ? 'Parent' : 'Teen'}</span>
          </button>

          <button
            onClick={onOpenCurrencyPicker}
            className="flex items-center gap-1 bg-zinc-900 border border-white/10 hover:border-white/20 px-2 py-1 rounded-xl text-xs font-bold text-zinc-300 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-3 h-3 text-zinc-400" />
            <span>{currency.symbol}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
