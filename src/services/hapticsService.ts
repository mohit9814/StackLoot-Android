import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const hapticsService = {
  async impactLight(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // ignore on unsupported web
    }
  },

  async impactMedium(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // ignore
    }
  },

  async impactHeavy(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // ignore
    }
  },

  async notifySuccess(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // ignore
    }
  },

  async notifyWarning(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // ignore
    }
  },
};
