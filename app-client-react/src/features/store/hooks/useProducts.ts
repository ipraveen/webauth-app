import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types';
import { getProducts } from '@/api/products';

export function useProducts() {
    const query = useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch every time user switches tabs
    });

    return query;
}
