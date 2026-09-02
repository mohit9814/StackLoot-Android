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
  },
  {
    icon: TrendingUp,
    tagline: 'THE BANK OF PARENT',
    title: 'You Set The Rules, They Learn Financial Discipline',
    description:
      'Match their savings, set milestone kickers, and watch their money visibly snowball. They learn the true power of investing before adulthood.',
    badge: '🏆 100% Parent Match',
  },
  {
    icon: Target,
    tagline: 'CHORES & WISHLISTS',
    title: 'Daily Responsibilities Unlock Dream Goals Faster',
    description:
      'Kids earn cash kickers for reading, homework, and chores, calculating exactly how many months faster they can afford their dream gadgets.',
    badge: '🎯 Smart Goal Predictor',
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative select-none">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-lg shadow-sm">
            💎
          </div>
          <span className="text-base font-black tracking-tight text-white">
            StackLoot
          </span>
        </div>

        <button
          onClick={onJoinAsTeen}
          className="text-xs font-bold text-zinc-400 hover:text-amber-400 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 active:scale-95 transition-all cursor-pointer"
        >
          Have a Code?
        </button>
      </div>

      {/* Center Slide Card */}
      <div className="my-auto py-6 space-y-6 relative z-10 animate-in fade-in duration-300" key={currentSlide}>
        <div className="p-8 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-white/10 flex items-center justify-center text-amber-400 shadow-sm">
            <Icon className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {slide.tagline}
          </span>

          <h2 className="text-xl font-black text-white leading-snug">
            {slide.title}
          </h2>

          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            {slide.description}
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-xl border border-emerald-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Actions */}
      <div className="space-y-3 pb-4 relative z-10">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/15 cursor-pointer"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Start Family Setup' : 'Continue'}</span>
          <ChevronRight className="w-4 h-4 text-zinc-950" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          <span>100% Private • No Bank Account Required</span>
        </div>
      </div>
    </div>
  );
};
