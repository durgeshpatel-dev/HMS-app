import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/colors';

export default function Index() {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If user is authenticated, redirect to appropriate tab based on role
  if (user) {
    const target =
      user.role === 'cook'
        ? '/(tabs)/kitchen'
        : '/(tabs)/tables';
    return <Redirect href={target} />;
  }

  // If not authenticated, redirect to phone login
  return <Redirect href="/phone-login" />;
}
