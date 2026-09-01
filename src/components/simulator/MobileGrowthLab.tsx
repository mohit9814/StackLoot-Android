import React from 'react';
import { Sliders, Rocket } from 'lucide-react';
import type { SimulationParams, CurrencyConfig, SimulationResult } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';

interface MobileGrowthLabProps {
  params: SimulationParams;
  onChangeParams: (params: SimulationParams) => void;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  onActivatePlan: () => void;
}

export const MobileGrowthLab: React.FC<MobileGrowthLabProps> = ({
  params,
  onChangeParams,
  simulation,
  currency,
  onActivatePlan,
}) => {
  const handlePreset = async (months: number, rate: number, bonus: number) => {
    await hapticsService.impactMedium();
    onChangeParams({
      ...params,
      termMonths: months,
      annualInterestRate: rate,
      completionBonusPercentage: bonus,
      deferralPercentage: 100,
      parentInterestMatchMultiplier: 1,
    });
  };

  const handleSliderChange = async (key: keyof SimulationParams, val: number) => {
    await hapticsService.impactLight();
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Interactive Growth Lab</h2>
            <p className="text-xs text-slate-400">Test how delayed gratification pays out</p>
          </div>
        </div>
      </div>

      {/* Challenge Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handlePreset(3, 30, 10)}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            params.termMonths === 3
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-xs font-bold block">3-Mo Sprint</span>
          <span className="text-[10px] opacity-75">30% + 10%</span>
        </button>

        <button
          onClick={() => handlePreset(6, 30, 20)}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            params.termMonths === 6
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-xs font-bold block">6-Mo Marathon</span>
          <span className="text-[10px] opacity-75">30% + 20%</span>
        </button>

        <button
          onClick={() => handlePreset(12, 35, 25)}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            params.termMonths === 12
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-xs font-bold block">12-Mo Master</span>
          <span className="text-[10px] opacity-75">35% + 25%</span>
        </button>
      </div>

      {/* Sliders Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        {/* Monthly Allowance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Monthly Allowance</span>
            <span className="text-white font-mono">{formatCurrency(params.monthlyAllowance, currency)}</span>
          </div>
          <input
            type="range"
            min={200}
            max={10000}
            step={100}
            value={params.monthlyAllowance}
            onChange={(e) => handleSliderChange('monthlyAllowance', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Deferral % Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Deferred into Vault</span>
            <span className="text-amber-400 font-mono">{params.deferralPercentage}% ({formatCurrency((params.monthlyAllowance * params.deferralPercentage) / 100, currency)}/mo)</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={params.deferralPercentage}
            onChange={(e) => handleSliderChange('deferralPercentage', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Annual Interest Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Bank of Dad Yield (p.a.)</span>
            <span className="text-emerald-400 font-mono">{params.annualInterestRate}% ({Number((params.annualInterestRate/12).toFixed(1))}%/mo)</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={params.annualInterestRate}
            onChange={(e) => handleSliderChange('annualInterestRate', Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Simulated Total Payout Outcome Card */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Simulated Snowball</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-amber-300 block">Total Net Gains</span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              +{formatCurrency(simulation.finalTotalBalance - simulation.totalPrincipalSaved, currency)}
            </span>
          </div>
        </div>

        <button
          onClick={onActivatePlan}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-sm rounded-2xl active:scale-98 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Rocket className="w-4 h-4" />
          <span>Activate These Rules in Vault</span>
        </button>
      </div>
    </div>
  );
};
