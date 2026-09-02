import confetti from 'canvas-confetti';

export const confettiService = {
  fireCelebration() {
    try {
      // 1. Safe burst with short ticks (120 frames ~ 2s max) to prevent lingering
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        ticks: 120,
        gravity: 1.2,
        scalar: 0.9,
        disableForReducedMotion: true,
        zIndex: 9999,
      });

      // 2. Safety cleanup: Force reset after 2.2 seconds to guarantee canvas removal
      setTimeout(() => {
        try {
          confetti.reset();
        } catch {
          // ignore
        }
      }, 2200);
    } catch (e) {
      console.warn('Confetti animation suppressed:', e);
    }
  },

  fireUnlock() {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        ticks: 140,
        gravity: 1.1,
        colors: ['#F59E0B', '#6366F1', '#10B981', '#EC4899'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });

      setTimeout(() => {
        try {
          confetti.reset();
        } catch {
          // ignore
        }
      }, 2500);
    } catch (e) {
      console.warn('Confetti unlock suppressed:', e);
    }
  },
};
