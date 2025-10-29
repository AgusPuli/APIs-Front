// SessionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");

    // IIFE async para esperar fetchUserDetails
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

  // Hacer que devuelva una promesa para poder await en useEffect/login
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
    } catch (err) {
      console.error("Error al obtener datos del usuario:", err);
      // Ante error, limpiar sesión para evitar estados inconsistentes
      setUser(null);
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
      value={{ token, user, login, logout, isLoggedIn: !!token, loading }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }
  return context;
}
