import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartState } from './types';

const CART_STORAGE_KEY = '@pharma-plus/cart';

export const CartStorage = {
  async save(cart: CartState): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  async load(): Promise<CartState | null> {
    try {
      const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading cart:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
};