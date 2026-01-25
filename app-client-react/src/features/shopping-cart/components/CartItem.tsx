import type { CartItem } from '@/types';
import { useCart } from '@/features/shopping-cart/hooks/useCart';

interface Props {
    item: CartItem;
}

export function CartItem({ item }: Props) {
    const { updateQuantity } = useCart();

    const { product, quantity, totalPrice } = item;

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateQuantity(product.id, Number(event.target.value));
    };

    return (
        <article key={product.id} className="p-2">
            <section className="bg-gray-50 p-6">
                <img
                    src={product.imageUrl ?? `https://placehold.co/600x400/png?text=${product.name}`}
                    alt={product.name}
                />
            </section>
            <section className="flex justify-between px-6">
                <h3>{product.name}</h3>
                <input
                    type="text"
                    onChange={handleQuantityChange}
                    className="w-8 text-center border border-gray-200"
                    value={quantity}
                />
                <p>${totalPrice.toFixed(2)}</p>
            </section>
        </article>
    );
}
