import { Preferences } from '@capacitor/preferences';
import type { UserProfile, CreateProfileParams } from '../types/profile';
import type { AppUserRole } from '../types/pairing';
import { DEFAULT_SIMULATION_PARAMS, DEFAULT_INITIAL_GOALS } from '../config/appConfig';

const STORAGE_KEY_PROFILES = 'stackloot_profiles_v1';
const STORAGE_KEY_ACTIVE_PROFILE_ID = 'stackloot_active_profile_id_v1';
const STORAGE_KEY_PARENT_PIN = 'stackloot_parent_pin_v1';
const STORAGE_KEY_USER_ROLE = 'stackloot_user_role_v1';
const STORAGE_KEY_ONBOARDING_DONE = 'stackloot_onboarding_done_v1';

export function createDefaultProfile(id = 'profile-akshat-default', name = 'Akshat'): UserProfile {
  return {
    id,
    teenName: name,
    parentName: 'Dad',
    avatarEmoji: '🚀',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currencyCode: 'INR',
    simulationParams: { ...DEFAULT_SIMULATION_PARAMS },
    activePlan: null,
    goals: [...DEFAULT_INITIAL_GOALS],
    gamification: {
      currentLevel: 1,
      totalXp: 50,
      unlockedBadgeIds: ['FIRST_DEPOSIT'],
      streakMonths: 0,
    },
  };
}

export const nativeStorage = {
  async getProfiles(): Promise<UserProfile[]> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_PROFILES });
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // fallback to localStorage
      const local = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const initial = [createDefaultProfile()];
      await this.saveProfiles(initial);
      return initial;
    } catch {
      return [createDefaultProfile()];
    }
  },

  async saveProfiles(profiles: UserProfile[]): Promise<void> {
    try {
      const json = JSON.stringify(profiles);
      await Preferences.set({ key: STORAGE_KEY_PROFILES, value: json });
      localStorage.setItem(STORAGE_KEY_PROFILES, json);
    } catch (e) {
      console.error('Failed to persist profiles:', e);
    }
  },

  async getActiveProfileId(): Promise<string> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_ACTIVE_PROFILE_ID });
      if (value) return value;
      const local = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
      if (local) return local;
      const profiles = await this.getProfiles();
      return profiles[0]?.id || 'profile-akshat-default';
    } catch {
      return 'profile-akshat-default';
    }
  },

  async setActiveProfileId(id: string): Promise<void> {
    try {
      await Preferences.set({ key: STORAGE_KEY_ACTIVE_PROFILE_ID, value: id });
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE_ID, id);
    } catch (e) {
      console.error('Failed to set active profile id:', e);
    }
  },

  async getParentPin(): Promise<string> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_PARENT_PIN });
      return value || '9874';
    } catch {
      return '9874';
    }
  },

  async setParentPin(pin: string): Promise<void> {
    try {
      await Preferences.set({ key: STORAGE_KEY_PARENT_PIN, value: pin });
    } catch (e) {
      console.error('Failed to set parent PIN:', e);
    }
  },

  async getUserRole(): Promise<AppUserRole> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_USER_ROLE });
      if (value === 'PARENT' || value === 'TEEN') return value;
      const local = localStorage.getItem(STORAGE_KEY_USER_ROLE);
      if (local === 'PARENT' || local === 'TEEN') return local;
      return 'TEEN';
    } catch {
      return 'TEEN';
    }
  },

  async setUserRole(role: AppUserRole): Promise<void> {
    try {
      await Preferences.set({ key: STORAGE_KEY_USER_ROLE, value: role });
      localStorage.setItem(STORAGE_KEY_USER_ROLE, role);
    } catch (e) {
      console.error('Failed to set user role:', e);
    }
  },

  async getOnboardingDone(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_ONBOARDING_DONE });
      if (value === 'true') return true;
      return localStorage.getItem(STORAGE_KEY_ONBOARDING_DONE) === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingDone(done: boolean): Promise<void> {
    try {
      await Preferences.set({ key: STORAGE_KEY_ONBOARDING_DONE, value: done ? 'true' : 'false' });
      localStorage.setItem(STORAGE_KEY_ONBOARDING_DONE, done ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to set onboarding done:', e);
    }
  },

  async createProfile(params: CreateProfileParams): Promise<UserProfile> {
    const profiles = await this.getProfiles();
    const id = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      id,
      teenName: params.teenName.trim() || 'New Saver',
      parentName: params.parentName?.trim() || 'Dad',
      avatarEmoji: params.avatarEmoji || '💎',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currencyCode: params.currencyCode || 'INR',
      simulationParams: {
        ...DEFAULT_SIMULATION_PARAMS,
        monthlyAllowance: params.monthlyAllowance || DEFAULT_SIMULATION_PARAMS.monthlyAllowance,
        deferralPercentage: params.deferralPercentage || DEFAULT_SIMULATION_PARAMS.deferralPercentage,
        annualInterestRate: params.annualInterestRate || DEFAULT_SIMULATION_PARAMS.annualInterestRate,
        termMonths: params.termMonths || DEFAULT_SIMULATION_PARAMS.termMonths,
      },
      activePlan: null,
      goals: [...DEFAULT_INITIAL_GOALS],
      gamification: {
        currentLevel: 1,
        totalXp: 50,
        unlockedBadgeIds: ['FIRST_DEPOSIT'],
        streakMonths: 0,
      },
    };

    const updated = [...profiles, newProfile];
    await this.saveProfiles(updated);
    await this.setActiveProfileId(id);
    return newProfile;
  },
};
