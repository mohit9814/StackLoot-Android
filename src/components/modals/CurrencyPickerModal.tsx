import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import type { CurrencyCode } from '../../types/allowance';
import { CURRENCIES } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';

interface CurrencyPickerModalProps {
  isOpen: boolean;
  currentCode: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  onClose: () => void;
}

export const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
  isOpen,
  currentCode,
  onSelectCurrency,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSelect = async (code: CurrencyCode) => {
    await hapticsService.impactLight();
    onSelectCurrency(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Select Currency</h3>
              <p className="text-[11px] text-zinc-400">Vault ledger currency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {Object.entries(CURRENCIES).map(([code, config]) => {
            const isSelected = currentCode === code;
            return (
              <button
                key={code}
                onClick={() => handleSelect(code as CurrencyCode)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 shadow-sm'
                    : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center font-mono font-black text-amber-400 text-sm">
                    {config.symbol}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white block">{config.label}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{config.code}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
