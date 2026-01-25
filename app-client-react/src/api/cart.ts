import axios from '@/api/axios';

export const fetchCart = async (cartId: string) => {
    const { data } = await axios.get(`/carts/${cartId}`);
    return data;
};

export const addCartItemApi = async ({ cartId, productId }: { cartId: string; productId: string }) => {
    const { data } = await axios.post(
        `/carts/${cartId}/items`,
        JSON.stringify({
            productId,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
    return data;
};

export const updateCartItemApi = async ({
    cartId,
    productId,
    quantity,
}: {
    cartId: string;
    productId: string;
    quantity: number;
}) => {
    const { data } = await axios.put(
        `/carts/${cartId}/items/${productId}`,
        JSON.stringify({
            quantity,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
    return data;
};
