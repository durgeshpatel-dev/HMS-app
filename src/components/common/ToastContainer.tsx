/**
 * Toast Container Component
 * Displays toast notifications
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../config/theme';
import { useToast } from '../../hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            toast.type === 'success' && styles.successToast,
            toast.type === 'error' && styles.errorToast,
            toast.type === 'info' && styles.infoToast,
          ]}
        >
          <Text
            style={[
              styles.toastText,
              toast.type === 'success' && styles.successText,
              toast.type === 'error' && styles.errorText,
              toast.type === 'info' && styles.infoText,
            ]}
          >
            {toast.message}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 9999,
    gap: theme.spacing.sm,
  },
  toast: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.lg,
  },
  successToast: {
    backgroundColor: theme.colors.success.main,
  },
  errorToast: {
    backgroundColor: theme.colors.error.main,
  },
  infoToast: {
    backgroundColor: theme.colors.primary.main,
  },
  toastText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  successText: {
    color: theme.colors.background.white,
  },
  errorText: {
    color: theme.colors.background.white,
  },
  infoText: {
    color: theme.colors.background.white,
  },
});
