import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import type { AppUserRole } from '../../types/pairing';
import { hapticsService } from '../../services/hapticsService';

interface RoleSelectionModalProps {
  isOpen: boolean;
  currentRole: AppUserRole;
  onSelectRole: (role: AppUserRole) => void;
  onClose: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  currentRole,
  onSelectRole,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleChoose = async (role: AppUserRole) => {
    await hapticsService.impactMedium();
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white">Select App Mode</h3>
            <p className="text-xs text-slate-400">Choose your device role</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Teen Mode Card */}
          <button
            onClick={() => handleChoose('TEEN')}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 cursor-pointer ${
              currentRole === 'TEEN'
                ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-amber-400 shadow-md'
                : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-2xl shadow-md">
                🚀
              </div>
              <div>
                <span className="text-sm font-black text-white block">Teen Junior Mode</span>
                <span className="text-xs text-slate-400">Track balance, earn yield, unlock loot</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Parent Mode Card */}
          <button
            onClick={() => handleChoose('PARENT')}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 cursor-pointer ${
              currentRole === 'PARENT'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400 shadow-md'
                : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center text-2xl shadow-md">
                👨‍👧
              </div>
              <div>
                <span className="text-sm font-black text-white block">Parent Studio Mode</span>
                <span className="text-xs text-slate-400">Set allowance rules, match yield, credit</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
