import React, { useState } from 'react';
import { Lock, ShieldAlert, X, Delete } from 'lucide-react';
import { hapticsService } from '../../services/hapticsService';

interface PinGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinGateModal: React.FC<PinGateModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigit = async (digit: string) => {
    await hapticsService.impactLight();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        // Check PIN (default 9874)
        if (nextPin === '9874') {
          await hapticsService.notifySuccess();
          onSuccess();
        } else {
          await hapticsService.notifyWarning();
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = async () => {
    await hapticsService.impactLight();
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-6 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parent Studio Lock</h3>
              <p className="text-xs text-slate-400">Enter 4-digit PIN (Default: 9874)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Circles Display */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 animate-bounce'
                    : isFilled
                    ? 'bg-amber-400 scale-110 shadow-lg shadow-amber-400/50'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-center text-xs text-rose-400 font-semibold flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incorrect PIN. Please try again.</span>
          </p>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-14 rounded-2xl bg-slate-800/80 active:bg-amber-500/20 text-xl font-bold text-white border border-slate-700/60 shadow-sm active:scale-95 transition-all flex items-center justify-center font-mono cursor-pointer"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-800/80 active:bg-amber-500/20 text-xl font-bold text-white border border-slate-700/60 shadow-sm active:scale-95 transition-all flex items-center justify-center font-mono cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-800/40 active:bg-rose-950/40 text-slate-400 hover:text-white border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
