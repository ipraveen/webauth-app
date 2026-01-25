import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addCartItemApi, fetchCart, updateCartItemApi } from '../../../api/cart';
import { CartContext } from './CartContext';
import type { CartState } from '@/types';

interface Props {
    children: React.ReactNode;
}

export const CartContextProvider = ({ children }: Props) => {
    const queryClient = useQueryClient();

    const { data: state, isLoading } = useQuery<CartState>({
        queryKey: ['cart'],
        queryFn: () => fetchCart('9db94f1f-8fb8-4ec7-85bf-5e22da563b15'),
    });

    const addCartItemMutation = useMutation({
        mutationFn: addCartItemApi,
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['cart'], updatedData);
        },
    });

    const updateCartItemMutation = useMutation({
        mutationFn: updateCartItemApi,
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['cart'], updatedData);
        },
    });

    const addToCart = (productId: string) => {
        addCartItemMutation.mutate({
            cartId: state!.id,
            productId,
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        updateCartItemMutation.mutate({
            cartId: state!.id,
            productId,
            quantity,
        });
    };

    const removeFromCart = (productId: string) => {
        console.log(productId);
    };

    return (
        <CartContext.Provider value={{ state, addToCart, updateQuantity, removeFromCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};
