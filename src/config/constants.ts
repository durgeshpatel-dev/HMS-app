/**
 * Application Constants
 */

export const APP_CONFIG = {
  name: 'HMS App',
  version: '1.0.0',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_KITCHEN: 'in-kitchen',
  READY: 'ready',
  BILLING: 'billing',
  COMPLETED: 'completed',
} as const;

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  BILLING: 'billing',
} as const;

export const TAX_RATE = 0.18; // 18% GST

export const SPICE_LEVELS = [
  { id: 'mild', label: 'Mild', icon: '🌶️' },
  { id: 'medium', label: 'Medium', icon: '🌶️🌶️' },
  { id: 'hot', label: 'Hot', icon: '🌶️🌶️🌶️' },
] as const;

export const DIET_PREFERENCES = [
  { id: 'veg', label: 'Veg', icon: '🥬' },
  { id: 'non-veg', label: 'Non-Veg', icon: '🍗' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
] as const;
