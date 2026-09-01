import type { CurrencyCode, CurrencyConfig } from '../types/allowance';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', locale: 'en-IN', decimals: 2 },
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', locale: 'de-DE', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', locale: 'en-GB', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'CAD ($)', locale: 'en-CA', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'AU$', label: 'AUD ($)', locale: 'en-AU', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'SG$', label: 'SGD ($)', locale: 'en-SG', decimals: 2 },
};

export function formatCurrency(amount: number, config: CurrencyConfig): string {
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  } catch {
    return `${config.symbol}${Math.round(amount).toLocaleString()}`;
  }
}

export function formatCurrencyExact(amount: number, config: CurrencyConfig): string {
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toFixed(2)}`;
  }
}
