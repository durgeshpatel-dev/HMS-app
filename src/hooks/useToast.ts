/**
 * Toast Notification Hook
 * Simple toast notifications for success/error messages
 */

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastMessage = {
  message: string;
  type: ToastType;
  id: number;
};

let toastListeners: Array<(toast: ToastMessage) => void> = [];
let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts };
};

export const showToast = {
  success: (message: string) => {
    const toast: ToastMessage = { message, type: 'success', id: toastId++ };
    toastListeners.forEach((listener) => listener(toast));
  },
  error: (message: string) => {
    const toast: ToastMessage = { message, type: 'error', id: toastId++ };
    toastListeners.forEach((listener) => listener(toast));
  },
  info: (message: string) => {
    const toast: ToastMessage = { message, type: 'info', id: toastId++ };
    toastListeners.forEach((listener) => listener(toast));
  },
};
