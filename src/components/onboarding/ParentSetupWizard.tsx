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

const DEFAULT_STARTER_CHORES = [
  { title: 'Read 20 Mins of a Non-Fiction Book', category: 'READING' as const, frequency: 'DAILY' as const, rewardAmount: 50, xpReward: 25, icon: '📚' },
  { title: 'Complete Homework Early', category: 'STUDY' as const, frequency: 'DAILY' as const, rewardAmount: 50, xpReward: 30, icon: '📐' },
  { title: 'Keep Study Desk & Room Organized', category: 'CHORES' as const, frequency: 'WEEKLY' as const, rewardAmount: 100, xpReward: 50, icon: '🧹' },
  { title: 'Daily 30-Min Workout / Sports Practice', category: 'FITNESS' as const, frequency: 'DAILY' as const, rewardAmount: 50, xpReward: 25, icon: '⚽' },
];

export const ParentSetupWizard: React.FC<ParentSetupWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

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
  const [annualInterestRate, setAnnualInterestRate] = useState(30);
  const [parentMatchMultiplier, setParentMatchMultiplier] = useState(1);

  // Step 4: Chores Selection
  const [selectedChores, setSelectedChores] = useState(DEFAULT_STARTER_CHORES);

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

  const handleToggleChore = (choreTitle: string) => {
    if (selectedChores.some((c) => c.title === choreTitle)) {
      setSelectedChores(selectedChores.filter((c) => c.title !== choreTitle));
    } else {
      const choreToAdd = DEFAULT_STARTER_CHORES.find((c) => c.title === choreTitle);
      if (choreToAdd) setSelectedChores([...selectedChores, choreToAdd]);
    }
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
        selectedChores
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 max-w-md mx-auto relative select-none">
      {/* Top Wizard Navigation */}
      <div className="flex items-center justify-between pt-1 pb-3 border-b border-slate-800/80">
        <button
          onClick={step === 1 ? onCancel : () => setStep((step - 1) as 1 | 2 | 3 | 4 | 5)}
          className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Step {step} of 5</span>
          <h2 className="text-xs font-black text-white">
            {step === 1 && 'Parent Persona & Currency'}
            {step === 2 && 'Setup Your Children'}
            {step === 3 && 'Allowance & Bank of Parent Yield'}
            {step === 4 && 'Chores & Responsibility Bounties'}
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
              <label className="text-xs font-bold text-slate-300">I Am The</label>
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
                        ? 'bg-indigo-600/20 border-indigo-400 text-white font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Your Name or Title</label>
              <input
                type="text"
                placeholder="e.g. Dad, Mom, or Rohit"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Currency</label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none cursor-pointer"
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

        {/* STEP 2: Children Setup */}
        {step === 2 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {children.map((child, index) => (
              <div key={child.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
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

                <div className="flex gap-1.5 flex-wrap pt-0.5">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => handleUpdateChild(child.id, { avatarEmoji: av })}
                      className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-all ${
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
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Another Child</span>
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Allowance & Bank of Parent Yield */}
        {step === 3 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Superpower of 30% Yield:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                When kids see their saved allowance grow at <strong>30% p.a. + 100% parent match</strong>, delayed gratification becomes an irresistible winning game.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Monthly Allowance</span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
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

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Bank of Parent Yield</span>
                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-600/40">
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

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Delayed Gratification Match</span>
                <span className="text-xs font-mono font-black text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-600/40">
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
                        ? 'bg-purple-600/20 border-purple-400 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m * 100}% Match
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Chores & Responsibility Setup */}
        {step === 4 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Starter Chores & Responsibilities</h3>
                <p className="text-[11px] text-slate-400">Select bounties to incentivize daily habits</p>
              </div>
            </div>

            <div className="space-y-2">
              {DEFAULT_STARTER_CHORES.map((chore) => {
                const isSelected = selectedChores.some((c) => c.title === chore.title);
                return (
                  <div
                    key={chore.title}
                    onClick={() => handleToggleChore(chore.title)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/60 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{chore.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{chore.title}</h4>
                        <span className="text-[10px] text-amber-300 font-bold uppercase">{chore.frequency}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-emerald-400 block">
                        +{formatCurrency(chore.rewardAmount, currencyConfig)}
                      </span>
                      <span className="text-[9px] font-bold text-indigo-300">+{chore.xpReward} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Wishlist Aspirations & Child Mobile Pairing Guide */}
        {step === 5 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Wishlist Guide Box */}
            <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl flex items-start gap-2.5">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Child Goal & Wishlist System</h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {primaryChildName} can add dream items (e.g. PlayStation, Bicycle) and see the exact month they can afford it!
                </p>
              </div>
            </div>

            {/* Mobile Pairing Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                <QrCode className="w-4 h-4" />
                <span>Pair {primaryChildName}'s Phone:</span>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-inner mx-auto inline-block">
                <QRCodeSVG value={pairingUrl} size={130} level="M" />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-black text-amber-400 text-lg tracking-widest">
                {familyInviteCode}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2.5 px-2 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-emerald-600/20"
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
      <div className="pt-2 pb-1 border-t border-slate-800">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 text-slate-950 font-black text-xs rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-xl shadow-indigo-500/25 cursor-pointer"
        >
          <span>{step === 5 ? 'Launch StackLoot Dashboard' : 'Next Step'}</span>
          <ChevronRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
