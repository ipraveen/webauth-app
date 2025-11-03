import { createContext, useEffect, useState } from 'react';
import  axios, { axiosPrivate, type AxiosResponse } from '@/api/axios';

export interface Auth {
    token: string;
    roles: string[];
    name: string;
}

export interface AuthContext {
    auth: Auth | null;
    setAuth: (auth: Auth) => void;
    logout: () => void;
}

interface Props {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContext>({
    auth: null,
    setAuth: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: Props) {
    const authSer = localStorage.getItem('AUTH_STATE');
    const [auth, setAuth] = useState<Auth | null>(authSer ? JSON.parse(authSer) : null);
    // const navigate = useNavigate();

    const logout = () => {
        setAuth(null);
        // navigate('/');
    };

    // Refresh access token
    const refreshAccessToken = async () => {
        console.log('==> Refreshing Token');
        const response: AxiosResponse<Auth> = await axiosPrivate.get<Auth>('/auth/refresh', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        console.log('==> Response: ', response);
        if (response?.data?.token != null) {
            setAuth((prev) => {
                if (prev == null) return null;

                return {
                    ...prev,
                    token: response.data.token,
                };
            });
        }
        return response?.data?.token;
    };

    // Axios interceptors
    useEffect(() => {
        // // Request interceptor
        // const requestInterceptor = axios.interceptors.request.use(
        //     (config) => {

        //         console.log("Request interceptor: Auth: ", auth)
        //         if (auth?.token) config.headers['Authorization'] = `Bearer ${auth.token}`;
        //         return config;
        //     },
        //     (error) => Promise.reject(error)
        // );

        // Response interceptor
        const responseInterceptor = axios.interceptors.response.use(
            (res) => res,
            async (error) => {
                const originalRequest = error.config;

                if (
                    (error.response?.status === 401 || error.response?.status === 403) &&
                    !originalRequest._retry &&
                    auth?.token
                ) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await refreshAccessToken();

                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axiosPrivate(originalRequest);
                    } catch (err) {
                        console.error(err);
                        logout();
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup
        return () => {
            // axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [auth]);

    // Save tokens when changed
    useEffect(() => {
        if (auth?.token) localStorage.setItem('AUTH_STATE', JSON.stringify(auth));
    }, [auth]);

    return <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>;
}

export default AuthContext;
