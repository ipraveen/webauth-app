import { useCart } from '@/features/shopping-cart/hooks/useCart';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '@/types';

export function Cart() {
    const { state } = useCart();
    const open = false;

    const className = [
        'fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 shadow-2xl',
        open ? '' : 'translate-x-full',
    ].join(' ');

    const products: CartItemType[] = state?.items;

    return (
        <div className={className}>
            <h1>Your Order</h1>
            {products?.map((item) => (
                <CartItem item={item} />
            ))}
        </div>
    );
}
