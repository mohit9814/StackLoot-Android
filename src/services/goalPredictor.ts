import type { SimulationParams } from '../types/allowance';

export interface GoalAffordabilityForecast {
  monthsNeeded: number;
  monthsWithChores: number;
  monthsSavedByChores: number;
  targetDate: string;
  projectedBalanceAtTarget: number;
  isAlreadyAffordable: boolean;
}

export function predictGoalAffordability(
  goalAmount: number,
  currentBalance: number,
  params: SimulationParams,
  estimatedMonthlyChoreBounty = 200
): GoalAffordabilityForecast {
  if (currentBalance >= goalAmount) {
    return {
      monthsNeeded: 0,
      monthsWithChores: 0,
      monthsSavedByChores: 0,
      targetDate: 'Now (Fully Funded!)',
      projectedBalanceAtTarget: currentBalance,
      isAlreadyAffordable: true,
    };
  }

  const monthlyDeposit = (params.monthlyAllowance * params.deferralPercentage) / 100;
  const monthlyRate = (params.annualInterestRate / 100) / 12;
  const matchMultiplier = params.parentInterestMatchMultiplier;

  // 1. Simulate Standard Compounding Path
  let balance = currentBalance;
  let months = 0;
  const maxMonths = 36; // 3 years max horizon

  while (balance < goalAmount && months < maxMonths) {
    months++;
    balance += monthlyDeposit;
    const interest = balance * monthlyRate;
    const match = interest * matchMultiplier;
    balance += interest + match;
  }

  // 2. Simulate Accelerated Path (With Chores / Task Bounties)
  let balanceWithChores = currentBalance;
  let monthsWithChores = 0;

  while (balanceWithChores < goalAmount && monthsWithChores < maxMonths) {
    monthsWithChores++;
    balanceWithChores += monthlyDeposit + estimatedMonthlyChoreBounty;
    const interest = balanceWithChores * monthlyRate;
    const match = interest * matchMultiplier;
    balanceWithChores += interest + match;
  }

  const monthsSaved = Math.max(0, months - monthsWithChores);

  // Calculate target date
  const targetDateObj = new Date();
  targetDateObj.setMonth(targetDateObj.getMonth() + months);
  const targetDateStr = targetDateObj.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return {
    monthsNeeded: months,
    monthsWithChores,
    monthsSavedByChores: monthsSaved,
    targetDate: targetDateStr,
    projectedBalanceAtTarget: Math.round(balance),
    isAlreadyAffordable: false,
  };
}
