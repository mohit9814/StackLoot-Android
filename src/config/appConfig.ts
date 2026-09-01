import type { SimulationParams } from '../types/allowance';
import type { SavingsGoal } from '../types/goal';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  monthlyAllowance: 1000,
  deferralPercentage: 100,
  annualInterestRate: 30,
  termMonths: 6,
  completionBonusPercentage: 20,
  parentInterestMatchMultiplier: 1,
  initialLumpSumDeposit: 0,
};

export const DEFAULT_INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Electric Guitar & Amp Upgrade',
    targetAmount: 12000,
    category: 'MUSIC',
    createdAt: new Date().toISOString(),
    notes: 'Yamaha Pacifica + Boss Katana Mini Amp',
  },
  {
    id: 'goal-2',
    title: 'High-Performance Gaming GPU / Console',
    targetAmount: 25000,
    category: 'GAMING',
    createdAt: new Date().toISOString(),
    notes: 'PlayStation 5 or RTX Graphics Card for PC build',
  },
  {
    id: 'goal-3',
    title: 'Noise Cancelling Headphones',
    targetAmount: 8000,
    category: 'TECH',
    createdAt: new Date().toISOString(),
    notes: 'Sony WH-CH720N for study & travel focus',
  },
];
