/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

// API Base URL - Change this to your backend URL when deployed
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api/v1' 
  : 'https://api.your-restaurant.com/api/v1';

// Socket.io URL
export const SOCKET_URL = __DEV__
  ? 'http://localhost:5000'
  : 'https://api.your-restaurant.com';

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  waiter: {
    phone: '9876543210',
    pin: '1234',
    name: 'John Doe (Waiter)'
  },
  cook: {
    phone: '9876543211',
    pin: '5678',
    name: 'Jane Smith (Cook)'
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/staff/login',
    REGISTER_PUSH_TOKEN: '/auth/staff/register-push-token',
    LOGOUT: '/auth/staff/logout',
  },
  
  // Menu
  MENU: {
    GET_ALL: '/menu',
    GET_BY_ID: (id: string) => `/menu/${id}`,
  },
  
  // Tables
  TABLES: {
    GET_ALL: '/tables',
    GET_BY_ID: (id: string) => `/tables/${id}`,
    UPDATE: (id: string) => `/tables/${id}`,
  },
  
  // Orders
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    MARK_READY: (id: string) => `/orders/${id}/ready`,
    MARK_BILLING: (id: string) => `/orders/${id}/billing`,
    KITCHEN_QUEUE: '/orders/kitchen',
  },
};
