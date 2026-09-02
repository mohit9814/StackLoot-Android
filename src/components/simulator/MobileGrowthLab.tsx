import React from 'react';
import { Sliders, Lock, Check } from 'lucide-react';
import type { SimulationParams, CurrencyConfig, SimulationResult } from '../../types/allowance';
import type { AppUserRole } from '../../types/pairing';
import { formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';

interface MobileGrowthLabProps {
  params: SimulationParams;
  onChangeParams: (params: SimulationParams) => void;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  userRole: AppUserRole;
  onActivatePlan: () => void;
}

export const MobileGrowthLab: React.FC<MobileGrowthLabProps> = ({
  params,
  onChangeParams,
  simulation,
  currency,
  userRole,
  onActivatePlan,
}) => {
  const baseRate = params.annualInterestRate || 30;

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
    <div className="space-y-3 pb-20 animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-zinc-900 border border-white/10 text-amber-400 rounded-xl">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-white">Growth Simulator</h2>
          <p className="text-[11px] text-zinc-400">
            {userRole === 'TEEN' ? 'Simulate how compounding accelerates' : 'Simulate compound yield rules'}
          </p>
        </div>
      </div>

      {/* Challenge Presets */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '3-Mo Sprint', months: 3, rate: baseRate, bonus: 10 },
          { label: '6-Mo Marathon', months: 6, rate: baseRate, bonus: 20 },
          { label: '12-Mo Master', months: 12, rate: baseRate + 5, bonus: 25 },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p.months, p.rate, p.bonus)}
            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
              params.termMonths === p.months
                ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-sm'
                : 'bg-zinc-900/80 border-white/5 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <span className="text-xs font-black block">{p.label}</span>
            <span className="text-[10px] font-bold text-zinc-300">{p.rate}% + {p.bonus}%</span>
          </button>
        ))}
      </div>

      {/* Sliders Card */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-3.5 shadow-sm space-y-2.5">
        {/* Monthly Allowance Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-zinc-300">Monthly Allowance</span>
            <span className="text-xs font-black text-white font-mono bg-zinc-950 px-2 py-0.5 rounded-lg border border-white/5">
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
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        {/* Deferral % Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-zinc-300">Deferred into Vault</span>
            <span className="text-[10px] font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
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
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        {/* Annual Interest Rate */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-zinc-300">Parent Compounding Yield (p.a.)</span>
            <span className="text-[10px] font-black text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
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
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>
      </div>

      {/* Simulated Outcome Banner */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Projected Snowball</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
              {formatCurrency(simulation.finalTotalBalance, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-amber-400 block">Net Gains</span>
            <span className="text-xs font-black text-amber-400 font-mono">
              +{formatCurrency(simulation.finalTotalBalance - simulation.totalPrincipalSaved, currency)}
            </span>
          </div>
        </div>

        <button
          onClick={onActivatePlan}
          className={`w-full py-3 font-black text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            userRole === 'PARENT'
              ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-400/15'
              : 'bg-zinc-800 text-zinc-300 border border-white/10 hover:bg-zinc-700'
          }`}
        >
          {userRole === 'PARENT' ? (
            <>
              <Check className="w-4 h-4 text-zinc-950" />
              <span>Lock In These Rules for Vault</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Parent PIN Required to Lock In Rules</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
