export type CartItem = {
  id: string;
  skuCode: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartState = {
  items: CartItem[];
};