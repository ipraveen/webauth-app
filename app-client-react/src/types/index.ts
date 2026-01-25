export interface Product {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    price: number;
    categoryId: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface CartState {
    id: string;
    items: CartItem[];
    totalPrice: number;
}

export interface ShoppingCartContextType {
  state: CartState | undefined;
  isLoading: boolean;
  addToCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}
