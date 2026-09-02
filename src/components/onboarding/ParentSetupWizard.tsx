import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Award,
  Target,
  QrCode,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import type { ParentPersona, ChildSetupInput, ParentOnboardingSetup } from '../../types/onboarding';
import type { CurrencyCode } from '../../types/allowance';
import type { ChoreTask } from '../../types/task';
import { CURRENCIES, formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface ParentSetupWizardProps {
  onComplete: (setup: ParentOnboardingSetup, starterChores: Omit<ChoreTask, 'id' | 'assignedToProfileId' | 'status'>[]) => void;
  onCancel: () => void;
}

const AVATARS = ['🚀', '💎', '🦁', '⚡', '🎮', '🎸', '👑', '🔥'];

const INITIAL_STARTER_CHORES: Omit<ChoreTask, 'id' | 'assignedToProfileId' | 'status'>[] = [
  { title: 'Read 20 Mins of a Non-Fiction Book', category: 'READING', frequency: 'DAILY', rewardAmount: 50, icon: '📚' },
  { title: 'Complete Homework Early', category: 'STUDY', frequency: 'DAILY', rewardAmount: 50, icon: '📐' },
  { title: 'Keep Study Desk & Room Organized', category: 'CHORES', frequency: 'WEEKLY', rewardAmount: 100, icon: '🧹' },
  { title: 'Daily 30-Min Workout / Sports Practice', category: 'FITNESS', frequency: 'DAILY', rewardAmount: 50, icon: '⚽' },
];

export const ParentSetupWizard: React.FC<ParentSetupWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Parent Persona & Name
  const [persona, setPersona] = useState<ParentPersona>('FATHER');
  const [parentName, setParentName] = useState('Dad');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');

  // Step 2: Children
  const [children, setChildren] = useState<ChildSetupInput[]>([
    { id: 'child-1', name: '', age: 14, avatarEmoji: '🚀' },
  ]);

  // Step 3: Allowance & Yield Rules
  const [monthlyAllowance, setMonthlyAllowance] = useState(1000);
  const [annualInterestRate, setAnnualInterestRate] = useState(30);
  const [parentMatchMultiplier, setParentMatchMultiplier] = useState(1);

  // Step 4: Chores Customization
  const [choresList, setChoresList] = useState(INITIAL_STARTER_CHORES);

  // Step 5: Copy status
  const [copied, setCopied] = useState(false);

  const currencyConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const primaryChildName = children[0]?.name.trim() || 'Your Child';
  const familyInviteCode = `LOOT-${(children[0]?.name || 'KID').slice(0, 3).toUpperCase()}98`;
  const pairingUrl = `http://192.168.1.10:5174/?role=TEEN&pair=${familyInviteCode}&teen=${encodeURIComponent(primaryChildName)}`;

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

  const handleChoreRewardChange = (index: number, newAmount: number) => {
    const updated = [...choresList];
    updated[index] = { ...updated[index], rewardAmount: newAmount };
    setChoresList(updated);
  };

  const handleChoreTitleChange = (index: number, newTitle: string) => {
    const updated = [...choresList];
    updated[index] = { ...updated[index], title: newTitle };
    setChoresList(updated);
  };

  const handleCopyCode = async () => {
    await hapticsService.impactLight();
    try {
      await navigator.clipboard.writeText(familyInviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = async () => {
    await hapticsService.impactMedium();
    const text = `Hey ${primaryChildName}! Join your StackLoot Vault: ${pairingUrl} or use Code: *${familyInviteCode}* to track allowance & earn 30% yield!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleNext = async () => {
    await hapticsService.impactLight();
    if (step === 1 && !parentName.trim()) return;
    if (step === 2 && children.some((c) => !c.name.trim())) return;

    if (step < 5) {
      setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      confettiService.fireCelebration();
      onComplete(
        {
          persona,
          parentName: parentName.trim(),
          currencyCode,
          children: children.map((c) => ({
            ...c,
            name: c.name.trim(),
          })),
          monthlyAllowance,
          deferralPercentage: 100,
          annualInterestRate,
          parentMatchMultiplier,
          completionBonusPercentage: 20,
          termMonths: 6,
        },
        choresList
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-4 max-w-md mx-auto relative select-none">
      {/* Top Wizard Navigation */}
      <div className="flex items-center justify-between pt-1 pb-3 border-b border-white/5">
        <button
          onClick={step === 1 ? onCancel : () => setStep((step - 1) as 1 | 2 | 3 | 4 | 5)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Step {step} of 5</span>
          <h2 className="text-xs font-black text-white">
            {step === 1 && 'Parent Persona & Currency'}
            {step === 2 && 'Setup Your Children'}
            {step === 3 && 'Allowance & Compounding Yield'}
            {step === 4 && 'Chores & Bounty Rewards'}
            {step === 5 && 'Wishlists & Child Mobile Pairing'}
          </h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Wizard Content Body */}
      <div className="my-auto py-2 space-y-3">
        {/* STEP 1: Parent Persona & Name */}
        {step === 1 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">I Am The</label>
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
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      persona === p.id
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                        : 'bg-zinc-900/80 border-white/5 text-zinc-400'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Your Name or Title</label>
              <input
                type="text"
                placeholder="e.g. Dad, Mom, or Rohit"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Currency</label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {Object.entries(CURRENCIES).map(([code, cfg]) => (
                  <option key={code} value={code} className="bg-zinc-900 text-white">
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Children Setup */}
        {step === 2 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {children.map((child, index) => (
              <div key={child.id} className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Child #{index + 1}</span>
                  {children.length > 1 && (
                    <button onClick={() => handleRemoveChild(child.id)} className="text-rose-400 text-xs p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">Child's Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Akshat"
                      value={child.name}
                      onChange={(e) => handleUpdateChild(child.id, { name: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      required
                      autoFocus={index === 0}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">Age (Years)</label>
                    <input
                      type="number"
                      min={5}
                      max={19}
                      value={child.age}
                      onChange={(e) => handleUpdateChild(child.id, { age: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 text-center"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap pt-0.5">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => handleUpdateChild(child.id, { avatarEmoji: av })}
                      className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-all ${
                        child.avatarEmoji === av ? 'bg-amber-400/20 border-amber-400 scale-110' : 'bg-zinc-950 border-white/5'
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
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Another Child</span>
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Allowance & Yield Rules */}
        {step === 3 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 bg-zinc-900 border border-amber-400/20 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Superpower of {annualInterestRate}% Yield:</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                When kids see their saved allowance grow at <strong>{annualInterestRate}% p.a. + {parentMatchMultiplier * 100}% parent match</strong>, delayed gratification becomes an irresistible winning game.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-300">Monthly Allowance</span>
                <span className="text-xs font-mono font-black text-white bg-zinc-950 px-2 py-0.5 rounded-lg border border-white/5">
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

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-300">Bank of {parentName} Yield</span>
                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
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

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-300">Delayed Gratification Match</span>
                <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                  {parentMatchMultiplier * 100}% Match
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1.0, 1.5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setParentMatchMultiplier(m)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      parentMatchMultiplier === m
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-zinc-950 border-white/5 text-zinc-400'
                    }`}
                  >
                    {m * 100}% Match
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Chores Customization */}
        {step === 4 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zinc-900 border border-white/10 text-amber-400 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Starter Chores & Bounty Amounts</h3>
                <p className="text-[11px] text-zinc-400">Edit chore names & cash rewards as you wish</p>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {choresList.map((chore, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{chore.icon}</span>
                    <input
                      type="text"
                      value={chore.title}
                      onChange={(e) => handleChoreTitleChange(idx, e.target.value)}
                      className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex justify-between items-center pl-7 text-[11px]">
                    <span className="text-zinc-400 uppercase font-semibold">{chore.frequency}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">Reward:</span>
                      <input
                        type="number"
                        value={chore.rewardAmount}
                        onChange={(e) => handleChoreRewardChange(idx, Number(e.target.value))}
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-emerald-400 font-mono font-bold text-right"
                      />
                      <span className="text-emerald-400 font-bold">{currencyConfig.symbol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Wishlists & Mobile Pairing Guide */}
        {step === 5 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Wishlist Guide Box */}
            <div className="p-3 bg-zinc-900 border border-white/10 rounded-2xl flex items-start gap-2.5">
              <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Child Goal & Wishlist System</h4>
                <p className="text-[11px] text-zinc-300 leading-tight">
                  {primaryChildName} can add dream items (PlayStation, Bicycle) and see the predictive compounding timeline to afford it!
                </p>
              </div>
            </div>

            {/* Mobile Pairing Card */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3.5 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                <QrCode className="w-4 h-4" />
                <span>Pair {primaryChildName}'s Phone:</span>
              </div>

              <div className="bg-white p-2.5 rounded-2xl shadow-inner mx-auto inline-block">
                <QRCodeSVG value={pairingUrl} size={120} level="M" />
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-xl p-1.5 font-mono font-black text-amber-400 text-base tracking-widest">
                {familyInviteCode}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2 px-2 bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-white/10 hover:bg-zinc-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action CTA */}
      <div className="pt-2 pb-1 border-t border-white/5">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer"
        >
          <span>{step === 5 ? 'Launch StackLoot Dashboard' : 'Next Step'}</span>
          <ChevronRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>
    </div>
  );
};
