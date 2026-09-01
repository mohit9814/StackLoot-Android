import React from 'react';
import { Globe, X, Check } from 'lucide-react';
import { CURRENCIES, type ExtendedCurrencyCode } from '../../config/currencies';
import type { CurrencyCode } from '../../types/allowance';
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

  const handleSelect = async (code: ExtendedCurrencyCode) => {
    await hapticsService.impactLight();
    onSelectCurrency(code as CurrencyCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Select Currency</h3>
              <p className="text-xs text-slate-400">Multi-currency global format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency List */}
        <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
          {Object.entries(CURRENCIES).map(([code, config]) => {
            const isSelected = currentCode === code;
            return (
              <button
                key={code}
                onClick={() => handleSelect(code as ExtendedCurrencyCode)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-amber-400 font-mono text-sm border border-slate-700">
                    {config.symbol}
                  </span>
                  <span className="text-xs font-semibold">{config.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
