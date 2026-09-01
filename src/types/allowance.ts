export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  decimals: number;
}

export interface SimulationParams {
  monthlyAllowance: number;
  deferralPercentage: number;
  annualInterestRate: number;
  termMonths: number;
  completionBonusPercentage: number;
  parentInterestMatchMultiplier: number;
  initialLumpSumDeposit?: number;
}

export interface MonthlyBreakdown {
  month: number;
  startingBalance: number;
  addedAllowance: number;
  liquidAllowance: number;
  interestEarned: number;
  parentInterestMatch: number;
  cumulativeInterest: number;
  endingBalance: number;
  standardBankEndingBalance: number;
}

export interface SimulationResult {
  breakdown: MonthlyBreakdown[];
  totalPrincipalSaved: number;
  totalLiquidPocketMoney: number;
  totalInterestEarned: number;
  totalParentInterestMatch: number;
  completionBonus: number;
  finalTotalBalance: number;
  bankComparisonTotal: number;
  effectiveAnnualYield: number;
  snowballFactor: number;
}

export type TransactionType = 'DEPOSIT' | 'INTEREST_CREDIT' | 'BONUS_MATCH' | 'EARLY_WITHDRAWAL';

export interface LedgerTransaction {
  id: string;
  date: string;
  monthIndex: number;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  notes?: string;
}

export interface ActivePlanLedger {
  planId: string;
  teenName: string;
  parentName: string;
  startDate: string;
  targetTermMonths: number;
  monthlyAllowance: number;
  deferralPercentage: number;
  annualInterestRate: number;
  completionBonusPercentage: number;
  parentInterestMatchMultiplier: number;
  initialLumpSumDeposit: number;
  currentBalance: number;
  totalPrincipalContributed: number;
  totalInterestEarned: number;
  totalBonusesEarned: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED_EARLY';
  transactions: LedgerTransaction[];
  selectedPerk?: string;
}

export interface OpportunityLossComparison {
  termMonths: number;
  cashPiggyBankTotal: number;
  compoundedTotal: number;
  compoundingYieldLost: number;
  percentGainOverPiggyBank: number;
}

export interface OpportunityLossReport {
  sixMonths: OpportunityLossComparison;
  oneYear: OpportunityLossComparison;
}
