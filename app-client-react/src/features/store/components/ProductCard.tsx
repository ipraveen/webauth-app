import type * as T from '@/types';
import { useCart } from '@/features/shopping-cart/hooks/useCart';

interface Props {
    product: T.Product;
}

export function ProductCard({ product }: Props) {
    const { addToCart } = useCart();

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
                <p>${product.price.toFixed(2)}</p>
            </section>
            <section className="flex justify-center">
                <button
                    className="bg-orange-400 hover:bg-orange-600 cursor-pointer text-white text-center py-1 px-6 rounded-xl "
                    onClick={() => addToCart(product.id as string)}
                >
                    Add to Cart
                </button>
            </section>
        </article>
    );
}
