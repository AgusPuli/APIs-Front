// SessionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const SessionContext = createContext();

export function SessionProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backendOffline, setBackendOffline] = useState(false); // NEW

    useEffect(() => {
        const savedToken = localStorage.getItem("jwt");

        (async () => {
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(savedToken);
                const exp = decoded.exp * 1000;

                if (Date.now() < exp) {
                    setToken(savedToken);
                    setLoading(true);

                    await fetchUserDetails(decoded.sub, savedToken);
                } else {
                    logout();
                }
            } catch (err) {
                console.error("Token inválido", err);
                logout();
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchUserDetails = async (email, jwt) => {
        try {
            const res = await fetch(`http://localhost:8080/users/email/${email}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            if (!res.ok) throw new Error("Error obteniendo datos del usuario");

            const data = await res.json();
            setUser({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
            });

            setBackendOffline(false); // servidor online nuevamente
        } catch (err) {
            console.warn("⚠ Backend desconectado. Manteniendo sesión local.");
            setBackendOffline(true);
            // ❌ No borramos user
            // ❌ No quitamos token
        }
    };

    const login = async (newToken) => {
        try {
            const decoded = jwtDecode(newToken);
            setToken(newToken);
            localStorage.setItem("jwt", newToken);
            setLoading(true);

            await fetchUserDetails(decoded.sub, newToken);
        } catch (err) {
            console.error("JWT inválido", err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("jwt");
    };

    return (
        <SessionContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isLoggedIn: !!token,
                loading,
                backendOffline, // puedes mostrar un banner si querés
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
