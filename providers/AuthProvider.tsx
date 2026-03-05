import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AuthService, { LoginResponse } from '../src/services/auth.service';
import SocketService from '../src/services/socket.service';
import NotificationService from '../src/services/notification.service';

type User = {
  id: string;
  name: string;
  phone: string;
  role: 'waiter' | 'cook';
  manager_id: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: (phone: string, pin: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'phone-login' || segments[0] === 'pin';
    
    if (!user && !inAuthGroup) {
      // Redirect to login
      router.replace('/phone-login');
    } else if (user && inAuthGroup) {
      // Redirect to appropriate tab based on role
      if (user.role === 'waiter') {
        router.replace('/(tabs)/tables');
      } else if (user.role === 'cook') {
        router.replace('/(tabs)/kitchen');
      }
    }
  }, [user, segments, isLoading]);

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Initialize Socket.io connection
        SocketService.connect(currentUser.id, currentUser.role);
        
        // Register for push notifications
        NotificationService.registerForPushNotifications();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (phone: string, pin: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await AuthService.login(phone, pin);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Initialize Socket.io connection
        SocketService.connect(response.user.id, response.user.role);
        
        // Register for push notifications
        NotificationService.registerForPushNotifications();
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.logout();
      SocketService.disconnect();
      setUser(null);
      router.replace('/phone-login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isLoading,
      signIn,
      signOut,
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
