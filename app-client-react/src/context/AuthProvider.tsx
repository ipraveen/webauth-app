import { createContext, useState } from 'react';

interface Auth {
    token: string;
    role: string;
    name: string;
}

interface AuthContext {
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
    const [auth, setAuth] = useState<Auth | null>(null);

    const logout = () => {
        setAuth(null);
    };
    return <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>;
}

export default AuthContext;
