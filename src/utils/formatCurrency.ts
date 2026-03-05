/**
 * Currency Formatting Utilities
 */

/**
 * Format number as currency (INR)
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Parse currency string to number
 * @param currency - Currency string (e.g., "₹100.00")
 * @returns Parsed number
 */
export const parseCurrency = (currency: string): number => {
  return parseFloat(currency.replace(/[₹,]/g, ''));
};
