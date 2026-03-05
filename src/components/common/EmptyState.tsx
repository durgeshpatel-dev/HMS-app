/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.neutral[600],
    textAlign: 'center',
  },
});
