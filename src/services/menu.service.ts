/**
 * Menu Service
 * Handles all menu-related API calls
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

class MenuService {
  /**
   * Get all menu items with optional category filter
   */
  async getMenuItems(category?: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MENU.GET_ALL, {
        params: category ? { category } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw error;
    }
  }

  /**
   * Get menu item by ID
   */
  async getMenuItemById(itemId: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MENU.GET_BY_ID(itemId));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      throw error;
    }
  }
}

export default new MenuService();
