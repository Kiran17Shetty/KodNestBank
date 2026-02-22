import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    username: string | null;
    role: string | null;
    uid: string | null;
    setAuth: (data: { username: string; role: string; uid: string } | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    username: null,
    role: null,
    uid: null,
    setAuth: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuthState] = useState<{ username: string; role: string; uid: string } | null>(null);

    const setAuth = (data: { username: string; role: string; uid: string } | null) => {
        setAuthState(data);
    };

    return (
        <AuthContext.Provider value={{ username: auth?.username ?? null, role: auth?.role ?? null, uid: auth?.uid ?? null, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
