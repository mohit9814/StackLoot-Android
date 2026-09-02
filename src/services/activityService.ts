import { Preferences } from '@capacitor/preferences';
import type { ActivityItem } from '../types/activity';

const STORAGE_KEY_ACTIVITIES = 'stackloot_activities_v1';

export const activityService = {
  async getActivities(profileId: string): Promise<ActivityItem[]> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_ACTIVITIES });
      let all: ActivityItem[] = [];
      if (value) {
        all = JSON.parse(value);
      } else {
        const local = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
        if (local) all = JSON.parse(local);
      }
      return all.filter((a) => a.profileId === profileId);
    } catch {
      return [];
    }
  },

  async addActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<ActivityItem[]> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_ACTIVITIES });
      let all: ActivityItem[] = [];
      if (value) all = JSON.parse(value);
      else {
        const local = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
        if (local) all = JSON.parse(local);
      }

      const newEntry: ActivityItem = {
        ...item,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      const updated = [newEntry, ...all].slice(0, 50); // Keep last 50
      const json = JSON.stringify(updated);
      await Preferences.set({ key: STORAGE_KEY_ACTIVITIES, value: json });
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, json);

      return updated.filter((a) => a.profileId === item.profileId);
    } catch (e) {
      console.error('Failed to log activity:', e);
      return [];
    }
  },
};
