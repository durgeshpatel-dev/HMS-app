import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Utensils, Phone, Lock } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useAuth } from '../providers/AuthProvider';

const IS_WEB = Platform.OS === 'web';
const MAX_CONTAINER_WIDTH = 480;

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Validation
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return;
    }

    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }

    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    setLoading(true);

    try {
      const success = await signIn(phone, pin);
      
      if (success) {
        // Navigation handled by AuthProvider based on user role
        // Waiter -> (tabs)/tables
        // Cook -> (tabs)/kitchen
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid phone number or PIN');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'waiter' | 'cook') => {
    if (role === 'waiter') {
      setPhone('9876543210');
      setPin('1234');
    } else {
      setPhone('9876543211');
      setPin('5678');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: IS_WEB ? 60 : insets.top + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={styles.brandIcon}>
            <Utensils size={32} color={colors.surface} />
          </View>
          <Text style={styles.brandTitle}>Saffron & Sage</Text>
          <Text style={styles.brandSubtitle}>Staff Login</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>
            Enter your phone number and PIN to continue
          </Text>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!loading}
              />
            </View>
          </View>

          {/* PIN Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PIN</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your PIN"
                placeholderTextColor={colors.textMuted}
                value={pin}
                onChangeText={(text) => setPin(text.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                editable={!loading}
              />
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          {/* Demo Credentials Helper */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Credentials (For Testing)</Text>
            <View style={styles.demoButtons}>
              <Pressable
                style={styles.demoButton}
                onPress={() => fillDemoCredentials('waiter')}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>Waiter Demo</Text>
                <Text style={styles.demoButtonSubtext}>9876543210 / 1234</Text>
              </Pressable>
              <Pressable
                style={styles.demoButton}
                onPress={() => fillDemoCredentials('cook')}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>Cook Demo</Text>
                <Text style={styles.demoButtonSubtext}>9876543211 / 5678</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2026 Saffron & Sage. All rights reserved.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxWidth: IS_WEB ? MAX_CONTAINER_WIDTH : undefined,
    width: '100%',
    alignSelf: IS_WEB ? 'center' : undefined,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  demoButtonSubtext: {
    fontSize: 11,
    color: colors.textMuted,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 32,
  },
});
