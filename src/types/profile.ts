import type { SimulationParams, ActivePlanLedger, CurrencyCode } from './allowance';
import type { SavingsGoal } from './goal';
import type { UserGamificationState } from './gamification';

export interface UserProfile {
  id: string;
  teenName: string;
  parentName: string;
  avatarEmoji: string;
  createdAt: string;
  updatedAt: string;
  currencyCode: CurrencyCode;
  simulationParams: SimulationParams;
  activePlan: ActivePlanLedger | null;
  goals: SavingsGoal[];
  gamification: UserGamificationState;
}

export interface CreateProfileParams {
  teenName: string;
  parentName?: string;
  avatarEmoji?: string;
  currencyCode?: CurrencyCode;
  monthlyAllowance?: number;
  deferralPercentage?: number;
  annualInterestRate?: number;
  termMonths?: number;
}
