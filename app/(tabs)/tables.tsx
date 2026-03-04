import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Users, Utensils, Receipt } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { formatDuration } from '../../utils/helpers';
import { useAuth } from '../../providers/AuthProvider';

type FilterKey = 'all' | 'occupied' | 'billing';

export default function Tables() {
  const { tables, orders, selectTable, getTableActiveOrder, getCartItemCount, clearCart } = useRestaurantStore();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredTables = useMemo(() => {
    if (filter === 'all') return tables;
    return tables.filter((table) => table.status === filter);
  }, [filter, tables]);

  const handleTablePress = (table: typeof tables[number]) => {
    selectTable(table);
    
    // If table has active order
    const activeOrder = getTableActiveOrder(table.id);
    
    if (activeOrder) {
      if (activeOrder.status === 'billing') {
        // Go to billing
        router.push(`/generate-bill?tableId=${table.id}`);
      } else if (activeOrder.status === 'ready') {
        // Show option to generate bill
        router.push(`/order/${activeOrder.id}`);
      } else {
        // Show order details
        router.push(`/order/${activeOrder.id}`);
      }
    } else {
      // New order - clear cart and go to menu
      clearCart();
      router.push(`/create-order?tableId=${table.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Utensils size={20} color="#FF6B35" />
            </View>
            <Text style={styles.headerTitle}>Floor Plan</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Bell size={20} color="#666" />
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.initials || 'JD'}</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {[
            { key: 'all', label: 'All Tables', icon: null },
            { key: 'occupied', label: 'Occupied', icon: '🔴' },
            { key: 'billing', label: 'Billing', icon: '💳' },
          ].map((item) => (
            <Pressable
              key={item.key}
              style={[
                styles.filterChip,
                filter === item.key && styles.filterChipActive
              ]}
              onPress={() => setFilter(item.key as FilterKey)}
            >
              {item.key === 'all' && filter === item.key && (
                <View style={styles.gridIcon}>
                  <View style={styles.gridDot} />
                  <View style={styles.gridDot} />
                  <View style={styles.gridDot} />
                  <View style={styles.gridDot} />
                </View>
              )}
              {item.key === 'occupied' && (
                <View style={styles.statusDot} />
              )}
              {item.key === 'billing' && (
                <Receipt size={14} color={filter === item.key ? '#FFF' : '#666'} />
              )}
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredTables.map((table) => {
            const isAvailable = table.status === 'available';
            const isBilling = table.status === 'billing';
            const cardStyle = isAvailable
              ? styles.cardFree
              : isBilling
                ? styles.cardBilling
                : styles.cardOccupied;
            const textColor = isAvailable ? '#D0D0D0' : '#FFF';

            const activeOrder = getTableActiveOrder(table.id);

            return (
              <Pressable
                key={table.id}
                style={[styles.tableCard, cardStyle]}
                onPress={() => handleTablePress(table)}
              >
                {!isAvailable && (
                  <View style={styles.cardHeader}>
                    <Text style={styles.statusBadge}>
                      {isBilling ? 'BILLING' : activeOrder?.status === 'ready' ? 'READY' : 'OCCUPIED'}
                    </Text>
                    {isBilling ? (
                      <Receipt size={18} color="#FFF" />
                    ) : activeOrder?.status === 'ready' ? (
                      <Utensils size={18} color="#FFF" />
                    ) : (
                      <Users size={18} color="#FFF" />
                    )}
                  </View>
                )}
                {isAvailable && (
                  <Text style={styles.freeLabel}>FREE</Text>
                )}
                <Text style={[styles.tableNumber, { color: textColor }]}>
                  {table.label}
                </Text>
                {activeOrder && !isAvailable ? (
                  <Text style={styles.tableMeta}>
                    {activeOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    {table.elapsedMinutes ? ` • ${formatDuration(table.elapsedMinutes)}` : ''}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5'
  },
  content: {
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(248, 247, 245, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500'
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600'
  },
  gridIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridDot: {
    width: 3,
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 1.5
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6a00'
  },
  checkIcon: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700'
  },
  checkIconActive: {
    color: '#FFF'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16
  },
  tableCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  cardFree: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    shadowOpacity: 0
  },
  cardBilling: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.2
  },
  cardOccupied: {
    backgroundColor: '#ff6a00',
    shadowColor: '#ff6a00',
    shadowOpacity: 0.2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  freeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  tableNumber: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38
  },
  tableMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4
  }
});
