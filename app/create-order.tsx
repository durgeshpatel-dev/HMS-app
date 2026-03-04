import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useRestaurantStore } from '../store/useRestaurantStore';
import MenuItemCard from '../components/MenuItemCard';
import ItemCustomizationModal from '../components/ItemCustomizationModal';
import { formatCurrency } from '../utils/helpers';

export default function CreateOrder() {
  const { menuItems, selectedTable, addOrder, orders } = useRestaurantStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [orderItems, setOrderItems] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [note, setNote] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean)));
    return ['All Items', 'Starters', 'Main Course', ...unique.filter(c => c !== 'Starters' && c !== 'Main Course')] as string[];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesQuery =
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        (item.description || '').toLowerCase().includes(normalized);
      const matchesCategory =
        activeCategory === 'All Items'
          ? true
          : item.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [activeCategory, menuItems, query]);

  const handleAddItem = (item: any) => {
    setSelectedItem(item);
    setShowCustomization(true);
  };

  const handleAddToOrder = (quantity: number, customizations: any) => {
    if (!selectedItem) return;

    setOrderItems((prev) => ({
      ...prev,
      [selectedItem.id]: (prev[selectedItem.id] || 0) + quantity
    }));
    setShowCustomization(false);
    setSelectedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems((prev) => {
      const nextCount = Math.max(0, (prev[itemId] || 0) - 1);
      if (nextCount === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: nextCount };
    });
  };

  const handleCreateOrder = () => {
    if (!selectedTable) return;
    if (Object.keys(orderItems).length === 0) return;

    // Check if there's an existing open order for this table
    const existingOrder = orders.find(
      (o) => o.tableId === selectedTable.id && o.status !== 'closed'
    );

    if (existingOrder) {
      // Navigate to order summary of existing order
      router.push(`/order-summary/${existingOrder.id}`);
      return;
    }

    const order = {
      id: `o${Date.now()}`,
      tableId: selectedTable.id,
      items: Object.entries(orderItems).map(([itemId, quantity]) => ({
        itemId,
        quantity,
        status: 'new' as const
      })),
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      notes: note.trim() || undefined
    };

    addOrder(order);

    // Navigate to order summary instead of orders list
    router.push(`/order-summary/${order.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
          <Text style={styles.title}>Menu</Text>
          <Pressable style={styles.filterButton}>
            <SlidersHorizontal size={24} color="#FF6B35" />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <Search size={20} color="#B87656" />
          <TextInput
            placeholder="Search dishes..."
            placeholderTextColor="#B87656"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                activeCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All Items' ? 'Popular Items' : activeCategory}
          </Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.menuList}>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              quantity={orderItems[item.id] || 0}
              onAdd={() => handleAddItem(item)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
        </View>

        {Object.keys(orderItems).length > 0 && (
          <Pressable style={[styles.viewOrderButton, { marginBottom: Math.max(insets.bottom, 24) }]} onPress={handleCreateOrder}>
            <Text style={styles.viewOrderText}>
              View Order ({Object.values(orderItems).reduce((a, b) => a + b, 0)} items)
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Customization Modal */}
      {selectedItem && (
        <ItemCustomizationModal
          visible={showCustomization}
          onClose={() => {
            setShowCustomization(false);
            setSelectedItem(null);
          }}
          onAddToOrder={handleAddToOrder}
          itemName={selectedItem.name}
          itemDescription={selectedItem.description}
          itemPrice={selectedItem.price}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5'
  },
  content: {
    paddingBottom: 100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d130c',
    flex: 1,
    textAlign: 'center'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1d130c'
  },
  categoryRow: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 16
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  categoryChipActive: {
    backgroundColor: '#ff6a00',
    borderColor: '#ff6a00',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  categoryText: {
    fontSize: 14,
    color: '#1d130c',
    fontWeight: '500'
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d130c'
  },
  seeAll: {
    fontSize: 14,
    color: '#ff6a00',
    fontWeight: '500'
  },
  menuList: {
    gap: 16,
    paddingHorizontal: 20
  },
  summaryCard: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textStrong,
    marginBottom: 12
  },
  summaryItems: {
    gap: 8
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryText: {
    fontSize: 13,
    color: colors.text
  },
  summaryPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textStrong
  },
  noteRow: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  noteInput: {
    fontSize: 12,
    color: colors.textStrong
  },
  viewOrderButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff6a00',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  viewOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF'
  }
});
