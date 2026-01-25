import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

export const StoreHome = () => {
    const { data: products, isLoading, isError } = useProducts();

    if (isLoading) return <div className="spinner">Loading fresh groceries...</div>;

    if (isError) return <div className="error">Error loading products. Please refresh.</div>;

    return (
        <div className="container grid grid-cols-3 gap-6">
            {products?.map((product) => (
                <ProductCard product={product} />
            ))}
        </div>
    );
};
