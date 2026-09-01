import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } catch {
      return false;
    }
  },

  async scheduleMonthlyDividendAlert(teenName: string, amountFormatted: string): Promise<void> {
    try {
      const hasPerm = await this.requestPermission();
      if (!hasPerm) return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: `🎉 ${teenName}'s Compound Dividend Ready!`,
            body: `${amountFormatted} was credited to your StackLoot vault by Dad. Watch your money snowball!`,
            id: Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 seconds test or scheduled
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    } catch (e) {
      console.warn('Local notifications error:', e);
    }
  },
};
