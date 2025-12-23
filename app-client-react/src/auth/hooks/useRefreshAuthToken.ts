import axios from '@/api/axios';
import { useAuth, type Auth } from '@/auth/hooks/useAuth';

export const useRefreshAuthToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true,
        });

        setAuth((prev: Auth) => {
            const { token } = response.data;
            return { ...prev, token };
        });

        return response.data.token;
    };

    return [refresh];
};
