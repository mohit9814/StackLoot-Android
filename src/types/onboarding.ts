export type ParentPersona = 'FATHER' | 'MOTHER' | 'GUARDIAN';

export interface ChildSetupInput {
  id: string;
  name: string;
  age: number;
  avatarEmoji: string;
}

export interface ParentOnboardingSetup {
  persona: ParentPersona;
  parentName: string;
  currencyCode: 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SGD' | 'AED' | 'JPY';
  children: ChildSetupInput[];
  monthlyAllowance: number;
  deferralPercentage: number;
  annualInterestRate: number;
  parentMatchMultiplier: number;
  completionBonusPercentage: number;
  termMonths: number;
}
