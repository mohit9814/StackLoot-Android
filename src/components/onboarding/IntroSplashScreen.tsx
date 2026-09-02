import React, { useState } from 'react';
import { Rocket, TrendingUp, Target, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { hapticsService } from '../../services/hapticsService';

interface IntroSplashScreenProps {
  onStartParentSetup: () => void;
  onJoinAsTeen: () => void;
}

const SLIDES = [
  {
    icon: Rocket,
    tagline: 'SUPERCHARGED ALLOWANCE',
    title: 'Turn Allowance into a Compounding Superpower',
    description:
      '3% bank interest is boring to teens. StackLoot lets parents reward delayed gratification with high-yield 30% compounding and matching bonuses.',
    badge: '⚡ 6.39x Faster Earning',
    gradient: 'from-amber-500/20 via-indigo-500/20 to-purple-500/20',
  },
  {
    icon: TrendingUp,
    tagline: 'THE BANK OF PARENT',
    title: 'You Set The Rules, They Learn Financial Discipline',
    description:
      'Match their savings, set milestone kickers, and watch their money visibly snowball. They learn the true power of investing before adulthood.',
    badge: '🏆 100% Parent Match',
    gradient: 'from-indigo-500/20 via-purple-500/20 to-emerald-500/20',
  },
  {
    icon: Target,
    tagline: 'CHORES & WISHLISTS',
    title: 'Daily Responsibilities Unlock Dream Goals Faster',
    description:
      'Kids earn cash kickers for reading, homework, and chores, calculating exactly how many months faster they can afford their dream gadgets.',
    badge: '🎯 Smart Goal Predictor',
    gradient: 'from-emerald-500/20 via-amber-500/20 to-indigo-500/20',
  },
];

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({
  onStartParentSetup,
  onJoinAsTeen,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {
    await hapticsService.impactLight();
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onStartParentSetup();
    }
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="flex items-center justify-between pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md text-lg">
            💎
          </div>
          <span className="text-base font-black tracking-tight bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
            StackLoot
          </span>
        </div>

        <button
          onClick={onJoinAsTeen}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 active:scale-95 transition-all cursor-pointer"
        >
          Have a Code?
        </button>
      </div>

      {/* Center Slide Card */}
      <div className="my-auto py-6 space-y-6 relative z-10 animate-in fade-in duration-300" key={currentSlide}>
        <div className={`p-8 rounded-3xl bg-gradient-to-b ${slide.gradient} border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-4`}>
          <div className="w-20 h-20 rounded-3xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-amber-400 shadow-xl">
            <Icon className="w-10 h-10" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
            {slide.tagline}
          </span>

          <h2 className="text-2xl font-black text-white leading-snug">
            {slide.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {slide.description}
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
            <span>{slide.badge}</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Actions */}
      <div className="space-y-3 pb-4 relative z-10">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 text-slate-950 font-black text-base rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Start Family Setup' : 'Continue'}</span>
          <ChevronRight className="w-5 h-5 text-slate-950" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>100% Private • No Bank Account Required</span>
        </div>
      </div>
    </div>
  );
};
