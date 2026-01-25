import type { ShoppingCartContextType } from '@/types';
import { createContext } from 'react';

export const CartContext = createContext<ShoppingCartContextType | undefined>(undefined);
