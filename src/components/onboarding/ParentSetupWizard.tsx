import React, { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import type { ParentPersona, ChildSetupInput, ParentOnboardingSetup } from '../../types/onboarding';
import type { CurrencyCode } from '../../types/allowance';
import { CURRENCIES, formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface ParentSetupWizardProps {
  onComplete: (setup: ParentOnboardingSetup) => void;
  onCancel: () => void;
}

const AVATARS = ['🚀', '💎', '🦁', '⚡', '🎮', '🎸', '👑', '🔥'];

export const ParentSetupWizard: React.FC<ParentSetupWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Parent Persona & Name
  const [persona, setPersona] = useState<ParentPersona>('FATHER');
  const [parentName, setParentName] = useState('Dad');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');

  // Step 2: Children (Name, Age only, Avatar)
  const [children, setChildren] = useState<ChildSetupInput[]>([
    { id: 'child-1', name: '', age: 14, avatarEmoji: '🚀' },
  ]);

  // Step 3: Allowance & Yield Rules
  const [monthlyAllowance, setMonthlyAllowance] = useState(1000);
  const [deferralPercentage] = useState(100);
  const [annualInterestRate, setAnnualInterestRate] = useState(30);
  const [parentMatchMultiplier, setParentMatchMultiplier] = useState(1);
  const [termMonths] = useState(6);

  const currencyConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const handleAddChild = () => {
    if (children.length >= 4) return;
    setChildren([
      ...children,
      {
        id: `child-${Date.now()}`,
        name: '',
        age: 12,
        avatarEmoji: AVATARS[children.length % AVATARS.length],
      },
    ]);
  };

  const handleRemoveChild = (id: string) => {
    if (children.length <= 1) return;
    setChildren(children.filter((c) => c.id !== id));
  };

  const handleUpdateChild = (id: string, updates: Partial<ChildSetupInput>) => {
    setChildren(children.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleNext = async () => {
    await hapticsService.impactLight();
    if (step === 1 && !parentName.trim()) return;
    if (step === 2 && children.some((c) => !c.name.trim())) return;

    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      confettiService.fireCelebration();
      onComplete({
        persona,
        parentName: parentName.trim(),
        currencyCode,
        children: children.map((c) => ({
          ...c,
          name: c.name.trim(),
        })),
        monthlyAllowance,
        deferralPercentage,
        annualInterestRate,
        parentMatchMultiplier,
        completionBonusPercentage: 20,
        termMonths,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-5 max-w-md mx-auto relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-800">
        <button
          onClick={step === 1 ? onCancel : () => setStep((step - 1) as 1 | 2 | 3)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Step {step} of 3</span>
          <h2 className="text-sm font-black text-white">
            {step === 1 && 'Parent Persona & Currency'}
            {step === 2 && 'Setup Your Children'}
            {step === 3 && 'Allowance & Compounding Yield'}
          </h2>
        </div>
        <div className="w-9" />
      </div>

      {/* Wizard Content */}
      <div className="my-auto py-4 space-y-5">
        {/* STEP 1: Parent Persona */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">I Am The</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'FATHER' as ParentPersona, label: 'Father / Dad', icon: '👨' },
                  { id: 'MOTHER' as ParentPersona, label: 'Mother / Mom', icon: '👩' },
                  { id: 'GUARDIAN' as ParentPersona, label: 'Guardian', icon: '🧑' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPersona(p.id);
                      setParentName(p.id === 'FATHER' ? 'Dad' : p.id === 'MOTHER' ? 'Mom' : 'Parent');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      persona === p.id
                        ? 'bg-indigo-600/20 border-indigo-400 text-white font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Name or Title</label>
              <input
                type="text"
                placeholder="e.g. Dad, Mom, or Rohit"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Currency</label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {Object.entries(CURRENCIES).map(([code, cfg]) => (
                  <option key={code} value={code} className="bg-slate-900 text-white">
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Children Names & Ages */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={child.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Child #{index + 1}</span>
                    {children.length > 1 && (
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Child's Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Akshat"
                        value={child.name}
                        onChange={(e) => handleUpdateChild(child.id, { name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                        required
                        autoFocus={index === 0}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Age (Years)</label>
                      <input
                        type="number"
                        min={5}
                        max={19}
                        value={child.age}
                        onChange={(e) => handleUpdateChild(child.id, { age: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 text-center"
                        required
                      />
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => handleUpdateChild(child.id, { avatarEmoji: av })}
                        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border transition-all ${
                          child.avatarEmoji === av ? 'bg-amber-500/20 border-amber-400 scale-110' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {children.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Another Child</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Allowance, Compounding & Incentive Rules */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Why Incentivizing Matters Educational Banner */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Why High-Yield Compounding Works:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standard 3% bank interest feels invisible. By offering <strong>30% p.a. (2.5%/mo) + 100% matching bonus</strong>, your teen visibly sees the thrilling mathematical reward of <strong>delayed gratification</strong>.
              </p>
            </div>

            {/* Allowance Slider */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Monthly Allowance</span>
                <span className="text-sm font-mono font-black text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  {formatCurrency(monthlyAllowance, currencyConfig)}/mo
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Bank of Parent Yield</span>
                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-600/40">
                  {annualInterestRate}% p.a. ({(annualInterestRate / 12).toFixed(1)}%/mo)
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Match Multiplier */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Parent Delayed Gratification Match</span>
                <span className="text-xs font-mono font-black text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-600/40">
                  {parentMatchMultiplier * 100}% Match
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 0.5, label: '50% Match' },
                  { val: 1.0, label: '100% Match' },
                  { val: 1.5, label: '150% Match' },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => setParentMatchMultiplier(m.val)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      parentMatchMultiplier === m.val
                        ? 'bg-purple-600/20 border-purple-400 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-3 pb-2 border-t border-slate-800">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 text-slate-950 font-black text-sm rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer"
        >
          <span>{step === 3 ? 'Launch Family Vault' : 'Next Step'}</span>
          <ChevronRight className="w-5 h-5 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
