import React, { useState } from 'react';
import { KeyRound, Sparkles, X, ArrowRight } from 'lucide-react';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface TeenPairingModalProps {
  isOpen: boolean;
  onPairSuccess: () => void;
  onClose: () => void;
}

export const TeenPairingModal: React.FC<TeenPairingModalProps> = ({
  isOpen,
  onPairSuccess,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 4) {
      await hapticsService.impactHeavy();
      confettiService.fireUnlock();
      onPairSuccess();
    } else {
      await hapticsService.notifyWarning();
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Enter Parent Code</h3>
              <p className="text-[11px] text-zinc-400">Join your family compounding vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              6-Digit Family Code
            </label>
            <input
              type="text"
              placeholder="e.g. LOOT-AKS98"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-zinc-950 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm font-mono font-black text-amber-400 text-center uppercase tracking-widest placeholder:text-zinc-600 focus:outline-none"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 text-center font-bold">
              Please enter a valid family invite code.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer"
          >
            <span>Connect & Launch Vault</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 text-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ask your Mom or Dad for their StackLoot QR or Code</span>
        </div>
      </div>
    </div>
  );
};
