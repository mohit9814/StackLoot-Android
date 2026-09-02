import React, { useState } from 'react';
import { KeyRound, CheckCircle2, X } from 'lucide-react';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface TeenPairingModalProps {
  isOpen: boolean;
  onPairSuccess: (code: string) => void;
  onClose: () => void;
}

export const TeenPairingModal: React.FC<TeenPairingModalProps> = ({
  isOpen,
  onPairSuccess,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) {
      setError('Please enter a valid family code');
      await hapticsService.notifyError();
      return;
    }

    await hapticsService.notifySuccess();
    confettiService.fireUnlock();

    onPairSuccess(cleanCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Join Family Vault</h3>
              <p className="text-xs text-slate-400">Ask your parent for the 6-digit code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enter Family Code
            </label>
            <input
              type="text"
              placeholder="e.g. LOOT-AKS98"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-center text-xl font-mono font-black text-amber-400 uppercase tracking-widest placeholder:text-slate-600 focus:outline-none"
              autoFocus
              maxLength={12}
            />
            {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 text-slate-950 font-black text-sm rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>Link My Vault</span>
          </button>
        </form>
      </div>
    </div>
  );
};
