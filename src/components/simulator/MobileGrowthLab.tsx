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
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl">
          <Sliders className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Interactive Growth Lab</h2>
          <p className="text-xs text-slate-400">Simulate how delayed gratification snowballs</p>
        </div>
      </div>

      {/* Challenge Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handlePreset(3, 30, 10)}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
            params.termMonths === 3
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="text-xs font-black block">3-Mo Sprint</span>
          <span className="text-[11px] font-bold text-amber-400">30% + 10%</span>
        </button>

        <button
          onClick={() => handlePreset(6, 30, 20)}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
            params.termMonths === 6
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="text-xs font-black block">6-Mo Marathon</span>
          <span className="text-[11px] font-bold text-amber-400">30% + 20%</span>
        </button>

        <button
          onClick={() => handlePreset(12, 35, 25)}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
            params.termMonths === 12
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="text-xs font-black block">12-Mo Master</span>
          <span className="text-[11px] font-bold text-amber-400">35% + 25%</span>
        </button>
      </div>

      {/* Sliders Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        {/* Monthly Allowance Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Monthly Allowance</span>
            <span className="text-base font-black text-white font-mono bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              {formatCurrency(params.monthlyAllowance, currency)}
            </span>
          </div>
          <input
            type="range"
            min={200}
            max={10000}
            step={100}
            value={params.monthlyAllowance}
            onChange={(e) => handleSliderChange('monthlyAllowance', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Deferral % Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Deferred into Vault</span>
            <span className="text-xs font-black text-amber-400 font-mono bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-600/40">
              {params.deferralPercentage}% ({formatCurrency((params.monthlyAllowance * params.deferralPercentage) / 100, currency)}/mo)
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={params.deferralPercentage}
            onChange={(e) => handleSliderChange('deferralPercentage', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Annual Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Bank of Dad Yield (p.a.)</span>
            <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-600/40">
              {params.annualInterestRate}% ({(params.annualInterestRate / 12).toFixed(1)}%/mo)
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={params.annualInterestRate}
            onChange={(e) => handleSliderChange('annualInterestRate', Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Simulated Outcome Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Total Simulated Snowball</span>
            <span className="text-3xl font-black text-emerald-400 font-mono mt-0.5 block">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-amber-300 block">Net Gains</span>
            <span className="text-sm font-black text-amber-400 font-mono">
              +{formatCurrency(simulation.finalTotalBalance - simulation.totalPrincipalSaved, currency)}
            </span>
          </div>
        </div>

        <button
          onClick={onActivatePlan}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 text-slate-950 font-black text-sm rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer"
        >
          <Rocket className="w-5 h-5 text-slate-950" />
          <span>Lock In These Rules for Vault</span>
        </button>
      </div>
    </div>
  );
};
