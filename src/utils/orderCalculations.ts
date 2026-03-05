/**
 * Order Calculation Utilities
 */

import type { Order, MenuItem } from '../types/order';
import { TAX_RATE } from '../config/constants';

/**
 * Calculate order subtotal (before tax and discount)
 * @param order - Order object
 * @param menuItems - Array of menu items
 * @returns Subtotal amount
 */
export const calculateOrderSubtotal = (
  order: Order,
  menuItems: MenuItem[]
): number => {
  return order.items.reduce((total, { itemId, quantity }) => {
    const item = menuItems.find((mi) => mi.id === itemId);
    return total + (item?.price || 0) * quantity;
  }, 0);
};

/**
 * Calculate tax amount
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate (default from constants)
 * @returns Tax amount
 */
export const calculateTax = (
  subtotal: number,
  taxRate: number = TAX_RATE
): number => {
  return subtotal * taxRate;
};

/**
 * Calculate discount amount
 * @param subtotal - Subtotal amount
 * @param discountPercent - Discount percentage
 * @returns Discount amount
 */
export const calculateDiscount = (
  subtotal: number,
  discountPercent: number
): number => {
  return subtotal * (discountPercent / 100);
};

/**
 * Calculate order total
 * @param subtotal - Subtotal amount
 * @param discountPercent - Discount percentage (optional)
 * @returns Final total amount
 */
export const calculateOrderTotal = (
  subtotal: number,
  discountPercent: number = 0
): number => {
  const discount = calculateDiscount(subtotal, discountPercent);
  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount);
  return afterDiscount + tax;
};

/**
 * Get order item count
 * @param order - Order object
 * @returns Total number of items
 */
export const getOrderItemCount = (order: Order): number => {
  return order.items.reduce((count, { quantity }) => count + quantity, 0);
};
