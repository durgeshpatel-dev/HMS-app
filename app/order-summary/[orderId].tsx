import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ChefHat, X } from 'lucide-react-native';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { formatCurrency } from '../../utils/helpers';

export default function OrderSummary() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders, tables, menuItems, getOrderItems, updateOrder, selectTable } = useRestaurantStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const order = orders.find((o) => o.id === orderId);
  const [localItems, setLocalItems] = useState(order?.items || []);
  const [notes, setNotes] = useState(order?.notes || '');

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Order not found</Text>
      </View>
    );
  }

  const table = tables.find((t) => t.id === order.tableId);
  const tableLabel = table?.label || order.tableId;

  const displayItems = localItems.map(li => {
    const menuItem = menuItems.find(mi => mi.id === li.itemId);
    return {
      id: li.itemId,
      item: menuItem || { id: li.itemId, name: 'Unknown', price: 0 },
      quantity: li.quantity
    };
  });

  const totalItems = displayItems.reduce((sum, { quantity }) => sum + quantity, 0);
  const totalAmount = displayItems.reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setLocalItems(prev => {
      return prev.map(item => {
        if (item.itemId === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setLocalItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  const handleAddMore = () => {
    // Save current changes first
    updateOrder(orderId, {
      items: localItems,
      notes: notes
    });
    selectTable(table || null);
    router.push('/create-order');
  };

  const handleSendToKitchen = () => {
    if (localItems.length === 0) {
      Alert.alert('Error', 'Order must have at least one item');
      return;
    }

    updateOrder(orderId, {
      items: localItems,
      notes: notes,
      status: 'preparing'
    });

    // Show success and navigate
    Alert.alert(
      'Order sent to kitchen',
      `Order #${orderId.slice(-3)} has been successfully received and preparation will begin immediately.`,
      [
        {
          text: 'Start New Order',
          onPress: () => router.push('/(tabs)/tables')
        },
        {
          text: 'Back to Tables',
          onPress: () => router.push('/(tabs)/tables')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.tableTitle}>Table {tableLabel}</Text>
            <Text style={styles.dineIn}>Dine In</Text>
          </View>
          <Pressable style={styles.addButton} onPress={handleAddMore}>
            <Plus size={20} color="#FF6B35" />
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </View>

        {/* Current Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Items</Text>
          <Text style={styles.sectionSubtitle}>
            Review your order before to kitchen
          </Text>

          <View style={styles.itemsList}>
            {displayItems.map(({ id, item, quantity }) => (
              <View key={id} style={styles.itemCard}>
                <View style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemLabel}>Mild Spicy</Text>
                    <Text style={styles.itemLabel}>No Garlic</Text>
                  </View>
                  <View style={styles.itemFooter}>
                    <View style={styles.quantityControl}>
                      <Pressable
                        style={[styles.quantityBtn, styles.quantityBtnMinus]}
                        onPress={() => handleUpdateQuantity(id, -1)}
                      >
                        <Minus size={16} color="#64748B" />
                      </Pressable>
                      <Text style={styles.quantityNumber}>{quantity}</Text>
                      <Pressable
                        style={[styles.quantityBtn, styles.quantityBtnPlus]}
                        onPress={() => handleUpdateQuantity(id, 1)}
                      >
                        <Plus size={16} color="#FFF" />
                      </Pressable>
                    </View>
                    <Text style={styles.itemPrice}>{formatCurrency(item.price * quantity)}</Text>
                  </View>
                </View>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(id)}
                >
                  <X size={16} color="#9CA3AF" />
                </Pressable>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Kitchen Note */}
        {notes && (
          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Kitchen Note</Text>
            <Text style={styles.noteText}>{notes}</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total items</Text>
            <Text style={styles.totalValue}>{totalItems}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
        <Pressable style={styles.sendButton} onPress={handleSendToKitchen}>
          <ChefHat size={20} color="#FFF" />
          <Text style={styles.sendButtonText}>Send to Kitchen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5'
  },
  content: {
    paddingBottom: 120
  },
  notFound: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#FFF'
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22
  },
  dineIn: {
    fontSize: 12,
    color: '#ff6a00',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ff6a00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF'
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16
  },
  itemsList: {
    gap: 0
  },
  itemCard: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    position: 'relative',
    alignItems: 'flex-start'
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    flexShrink: 0
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 80
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 4
  },
  itemLabel: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500'
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 4
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 4
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantityBtnMinus: {
    backgroundColor: '#F1F5F9'
  },
  quantityBtnPlus: {
    backgroundColor: '#ff6a00',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 16,
    textAlign: 'center'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: -4,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBadge: {
    position: 'absolute',
    top: 16,
    right: 40,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700'
  },
  noteSection: {
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8
  },
  noteText: {
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  totalSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500'
  },
  totalValue: {
    fontSize: 24,
    color: '#0F172A',
    fontWeight: '700'
  },
  totalLabelBold: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B'
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6a00'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8
  },
  sendButton: {
    backgroundColor: '#ff6a00',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF'
  }
});
