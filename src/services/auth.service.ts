/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient, { storage } from './api';
import { API_ENDPOINTS, DEMO_CREDENTIALS } from '../config/api.config';

export interface LoginRequest {
  phone: string;
  pin: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: 'waiter' | 'cook';
    manager_id: string;
  };
}

export interface RegisterPushTokenRequest {
  expo_push_token: string;
}

class AuthService {
  /**
   * Login with phone and PIN
   * Falls back to demo credentials if backend is not available
   */
  async login(phone: string, pin: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        { phone, pin }
      );

      if (response.data.success && response.data.token) {
        // Save token and user data
        await storage.saveToken(response.data.token);
        await storage.saveUser(response.data.user);
        return response.data;
      }

      throw new Error('Login failed');
    } catch (error: any) {
      console.log('Backend not available, using demo credentials');
      
      // Fallback to demo credentials for testing
      if (phone === DEMO_CREDENTIALS.waiter.phone && pin === DEMO_CREDENTIALS.waiter.pin) {
        const demoResponse: LoginResponse = {
          success: true,
          token: 'demo_token_waiter_' + Date.now(),
          user: {
            id: 'demo_waiter_1',
            name: DEMO_CREDENTIALS.waiter.name,
            phone: DEMO_CREDENTIALS.waiter.phone,
            role: 'waiter',
            manager_id: 'demo_manager_1',
          },
        };
        await storage.saveToken(demoResponse.token);
        await storage.saveUser(demoResponse.user);
        return demoResponse;
      }
      
      if (phone === DEMO_CREDENTIALS.cook.phone && pin === DEMO_CREDENTIALS.cook.pin) {
        const demoResponse: LoginResponse = {
          success: true,
          token: 'demo_token_cook_' + Date.now(),
          user: {
            id: 'demo_cook_1',
            name: DEMO_CREDENTIALS.cook.name,
            phone: DEMO_CREDENTIALS.cook.phone,
            role: 'cook',
            manager_id: 'demo_manager_1',
          },
        };
        await storage.saveToken(demoResponse.token);
        await storage.saveUser(demoResponse.user);
        return demoResponse;
      }

      throw new Error('Invalid phone number or PIN');
    }
  }

  /**
   * Register device push token for notifications
   */
  async registerPushToken(expoPushToken: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.REGISTER_PUSH_TOKEN, {
        expo_push_token: expoPushToken,
      });
    } catch (error) {
      console.error('Failed to register push token:', error);
      // Don't throw - notification registration shouldn't block app usage
    }
  }

  /**
   * Logout - Clear local storage and notify backend
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      await storage.clearAll();
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser() {
    return await storage.getUser();
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getToken();
    return !!token;
  }
}

export default new AuthService();
