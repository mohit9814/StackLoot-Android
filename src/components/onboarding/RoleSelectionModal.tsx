import React from 'react';
import { ShieldCheck, User, X, Check, RefreshCw } from 'lucide-react';
import type { AppUserRole } from '../../types/pairing';
import { hapticsService } from '../../services/hapticsService';

interface RoleSelectionModalProps {
  isOpen: boolean;
  currentRole: AppUserRole;
  onSelectRole: (role: AppUserRole) => void;
  onResetOnboarding: () => void;
  onClose: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  currentRole,
  onSelectRole,
  onResetOnboarding,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleChoose = async (role: AppUserRole) => {
    await hapticsService.impactMedium();
    onSelectRole(role);
    onClose();
  };

  const handleReset = async () => {
    await hapticsService.impactHeavy();
    onResetOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div>
            <h3 className="text-sm font-black text-white">Switch App Persona</h3>
            <p className="text-[11px] text-zinc-400">Control view & permission mode</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Teen Mode */}
          <button
            onClick={() => handleChoose('TEEN')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              currentRole === 'TEEN'
                ? 'bg-amber-400/10 border-amber-400 shadow-sm'
                : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-800 text-amber-400 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">Teen / Kid View</span>
                <span className="text-[10px] text-zinc-400">Vault, Wishlist & Chores</span>
              </div>
            </div>
            {currentRole === 'TEEN' && <Check className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Parent Mode */}
          <button
            onClick={() => handleChoose('PARENT')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              currentRole === 'PARENT'
                ? 'bg-amber-400/10 border-amber-400 shadow-sm'
                : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-800 text-amber-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">Parent Studio OS</span>
                <span className="text-[10px] text-zinc-400">Rules & Month Progression (PIN Protected)</span>
              </div>
            </div>
            {currentRole === 'PARENT' && <Check className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Reset Setup Wizard Link */}
        <div className="pt-2 border-t border-white/5">
          <button
            onClick={handleReset}
            className="w-full py-2.5 text-zinc-400 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Restart Setup Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
