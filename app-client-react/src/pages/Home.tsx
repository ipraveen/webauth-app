import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/products';
import type { Product } from '@/types';

const Home = () => {
    const query = useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: getProducts,
    });

    if (query.isLoading) {
        return <h1>Loading...</h1>;
    }

    if (query.isError) {
        return <pre>{JSON.stringify(query.error)}</pre>;
    }
    // return <pre>{JSON.stringify(query.data, null, 2)}</pre>;

    return (
        <>
            <table className="w-full border-collapse border border-gray-400 bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300">Name</th>
                        <th className="p-2 border border-gray-300">Description</th>
                        <th className="p-2 border border-gray-300">Price</th>
                        <th className="p-2 border border-gray-300">Category</th>
                    </tr>
                </thead>
                
                <tbody>
                    {query.data?.map((product) => (
                        <tr key={product.id}>
                            <td className="p-2 border border-gray-300">{product.name}</td>
                            <td className="p-2 border border-gray-300">{product.description}</td>
                            <td className="p-2 border border-gray-300">{product.price}</td>
                            <td className="p-2 border border-gray-300">{product.categoryId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
export default Home;
