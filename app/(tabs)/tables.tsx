import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Users, Utensils } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { formatDuration } from '../../utils/helpers';
import { useAuth } from '../../providers/AuthProvider';

type FilterKey = 'all' | 'occupied' | 'ready';

export default function Tables() {
  const { tables, orders, selectTable } = useRestaurantStore();
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
    if (table.status === 'free') {
      router.push('/create-order');
      return;
    }
    const activeOrder = orders.find(
      (order) => order.tableId === table.id && order.status !== 'closed'
    );
    if (activeOrder) {
      router.push(`/order/${activeOrder.id}`);
      return;
    }
    router.push('/create-order');
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
            { key: 'ready', label: 'Food Ready', icon: '✓' },
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
              {item.key === 'ready' && (
                <Text style={[styles.checkIcon, filter === item.key && styles.checkIconActive]}>✓</Text>
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
            const isFree = table.status === 'free';
            const isReady = table.status === 'ready';
            const cardStyle = isFree
              ? styles.cardFree
              : isReady
                ? styles.cardReady
                : styles.cardOccupied;
            const textColor = isFree ? '#D0D0D0' : '#FFF';

            const activeOrder = orders.find(
              (order) => order.tableId === table.id && order.status !== 'closed'
            );

            return (
              <Pressable
                key={table.id}
                style={[styles.tableCard, cardStyle]}
                onPress={() => handleTablePress(table)}
              >
                {!isFree && (
                  <View style={styles.cardHeader}>
                    <Text style={styles.statusBadge}>
                      {isReady ? 'READY' : 'OCCUPIED'}
                    </Text>
                    {isReady ? (
                      <Utensils size={18} color="#FFF" />
                    ) : (
                      <Users size={18} color="#FFF" />
                    )}
                  </View>
                )}
                {isFree && (
                  <Text style={styles.freeLabel}>FREE</Text>
                )}
                <Text style={[styles.tableNumber, { color: textColor }]}>
                  {table.label}
                </Text>
                {isReady && activeOrder ? (
                  <Text style={styles.orderNumber}>Order #{activeOrder.id.slice(-3)}</Text>
                ) : !isFree ? (
                  <Text style={styles.tableMeta}>
                    {table.guests || 0} Guests • {formatDuration(table.elapsedMinutes)}
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
  cardReady: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
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
