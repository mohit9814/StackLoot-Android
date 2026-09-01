import type {
  SimulationParams,
  SimulationResult,
  MonthlyBreakdown,
  OpportunityLossReport,
  OpportunityLossComparison,
} from '../types/allowance';

export function calculateCompoundSchedule(params: SimulationParams): SimulationResult {
  const {
    monthlyAllowance,
    deferralPercentage,
    annualInterestRate,
    termMonths,
    completionBonusPercentage,
    parentInterestMatchMultiplier,
    initialLumpSumDeposit = 0,
  } = params;

  const monthlyDeferredPrincipal = (monthlyAllowance * deferralPercentage) / 100;
  const monthlyLiquidPocket = monthlyAllowance - monthlyDeferredPrincipal;
  const monthlyRate = (annualInterestRate / 100) / 12;
  const standardBankMonthlyRate = (0.04) / 12; // 4% standard bank comparison

  const breakdown: MonthlyBreakdown[] = [];
  let currentBalance = initialLumpSumDeposit;
  let totalInterest = 0;
  let totalParentMatch = 0;
  let bankBalance = initialLumpSumDeposit;

  for (let month = 1; month <= termMonths; month++) {
    const startingBalance = currentBalance;
    const addedAllowance = monthlyDeferredPrincipal;
    const balanceBeforeInterest = startingBalance + addedAllowance;
    
    // Monthly interest applied on mid-term / end-term accumulated balance
    const interestEarned = balanceBeforeInterest * monthlyRate;
    const parentInterestMatch = interestEarned * parentInterestMatchMultiplier;
    
    totalInterest += interestEarned;
    totalParentMatch += parentInterestMatch;
    
    currentBalance = balanceBeforeInterest + interestEarned;
    
    const bankBalanceBeforeInterest = bankBalance + addedAllowance;
    const bankInterest = bankBalanceBeforeInterest * standardBankMonthlyRate;
    bankBalance = bankBalanceBeforeInterest + bankInterest;

    breakdown.push({
      month,
      startingBalance,
      addedAllowance,
      liquidAllowance: monthlyLiquidPocket,
      interestEarned,
      parentInterestMatch,
      cumulativeInterest: totalInterest,
      endingBalance: currentBalance,
      standardBankEndingBalance: bankBalance,
    });
  }

  const totalPrincipalSaved = (monthlyDeferredPrincipal * termMonths) + initialLumpSumDeposit;
  const totalLiquidPocketMoney = monthlyLiquidPocket * termMonths;
  const completionBonus = (totalPrincipalSaved * completionBonusPercentage) / 100;
  const finalTotalBalance = currentBalance + totalParentMatch + completionBonus;

  // Snowball factor: ratio of final month's interest to month 1 interest
  const firstMonthInterest = breakdown[0]?.interestEarned || 1;
  const lastMonthInterest = breakdown[breakdown.length - 1]?.interestEarned || 1;
  const snowballFactor = firstMonthInterest > 0 ? Number((lastMonthInterest / firstMonthInterest).toFixed(2)) : 1;

  const totalGains = totalInterest + totalParentMatch + completionBonus;
  const effectiveAnnualYield = totalPrincipalSaved > 0 
    ? ((totalGains / totalPrincipalSaved) * (12 / termMonths)) * 100 
    : 0;

  return {
    breakdown,
    totalPrincipalSaved,
    totalLiquidPocketMoney,
    totalInterestEarned: totalInterest,
    totalParentInterestMatch: totalParentMatch,
    completionBonus,
    finalTotalBalance,
    bankComparisonTotal: bankBalance,
    effectiveAnnualYield,
    snowballFactor,
  };
}

export function calculateOpportunityLoss(
  monthlyAllowance: number,
  deferralPercentage: number,
  annualInterestRate: number,
  parentInterestMatchMultiplier: number,
  completionBonusPercentage: number,
  initialLumpSumDeposit: number = 0
): OpportunityLossReport {
  const getComparisonForMonths = (months: number): OpportunityLossComparison => {
    const sim = calculateCompoundSchedule({
      monthlyAllowance,
      deferralPercentage,
      annualInterestRate,
      termMonths: months,
      completionBonusPercentage,
      parentInterestMatchMultiplier,
      initialLumpSumDeposit,
    });

    const cashPiggyBankTotal = sim.totalPrincipalSaved;
    const compoundedTotal = sim.finalTotalBalance;
    const compoundingYieldLost = Math.max(0, compoundedTotal - cashPiggyBankTotal);
    const percentGainOverPiggyBank = cashPiggyBankTotal > 0
      ? Math.round((compoundingYieldLost / cashPiggyBankTotal) * 100)
      : 0;

    return {
      termMonths: months,
      cashPiggyBankTotal,
      compoundedTotal,
      compoundingYieldLost,
      percentGainOverPiggyBank,
    };
  };

  return {
    sixMonths: getComparisonForMonths(6),
    oneYear: getComparisonForMonths(12),
  };
}

export function calculateEarlyWithdrawal(
  currentBalance: number,
  totalPrincipalContributed: number,
  totalGainsEarned: number
): {
  withdrawablePrincipal: number;
  forfeitedGains: number;
  penaltyPercentage: number;
} {
  const withdrawablePrincipal = totalPrincipalContributed;
  const forfeitedGains = Math.max(0, totalGainsEarned);
  const penaltyPercentage = currentBalance > 0
    ? Math.round((forfeitedGains / currentBalance) * 100)
    : 0;

  return {
    withdrawablePrincipal,
    forfeitedGains,
    penaltyPercentage,
  };
}
