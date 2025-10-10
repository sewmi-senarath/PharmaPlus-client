import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from './types';
import { useCartContext } from './CartContext';
import Ionicons from "@expo/vector-icons/Ionicons";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { addToCart, removeFromCart } = useCartContext();

  const handleIncrement = () => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = () => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name || item.skuCode}</Text>
        <Text style={styles.price}>LKR {item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <Pressable onPress={handleDecrement} style={styles.quantityButton}>
          <Ionicons name="remove-outline" size={18} color="#4b5563" />
        </Pressable>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <Pressable onPress={handleIncrement} style={styles.quantityButton}>
          <Ionicons name="add-outline" size={18} color="#4b5563" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  details: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    color: '#0d9488',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 4,
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});