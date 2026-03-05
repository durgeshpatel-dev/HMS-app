/**
 * General Helper Functions
 */

/**
 * Generate unique ID with optional prefix
 * @param prefix - Optional prefix for ID
 * @returns Unique ID string
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email address
 * @param email - Email string to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param phone - Phone number string
 * @returns True if valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Delay execution
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Truncate string to max length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};
