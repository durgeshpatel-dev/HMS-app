/**
 * Order Service
 * Handles all order-related API calls
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';
import type { Order } from '../types/order';

export interface CreateOrderRequest {
  table_id: string;
  order_type: 'dine-in';
  items: {
    menu_item_id: string;
    quantity: number;
    customizations?: {
      spiceLevel?: string;
      dietPreference?: string;
      notes?: string;
    };
  }[];
  special_instructions?: string;
}

class OrderService {
  /**
   * Get all orders with optional filters
   */
  async getOrders(params?: {
    status?: string;
    order_type?: string;
    table_id?: string;
  }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  /**
   * Get kitchen orders queue
   */
  async getKitchenOrders(type?: 'all' | 'dine-in' | 'parcel') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.KITCHEN_QUEUE, {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  /**
   * Create new order (Waiter only)
   */
  async createOrder(orderData: CreateOrderRequest) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  /**
   * Mark order as ready (Cook only)
   */
  async markOrderReady(orderId: string) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDERS.MARK_READY(orderId));
      return response.data;
    } catch (error) {
      console.error('Failed to mark order as ready:', error);
      throw error;
    }
  }

  /**
   * Mark order as billing (Waiter only)
   */
  async markOrderBilling(orderId: string) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDERS.MARK_BILLING(orderId));
      return response.data;
    } catch (error) {
      console.error('Failed to mark order as billing:', error);
      throw error;
    }
  }
}

export default new OrderService();
