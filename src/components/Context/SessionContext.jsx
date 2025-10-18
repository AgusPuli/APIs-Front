import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const exp = decoded.exp * 1000;
        if (Date.now() < exp) {
          setToken(savedToken);
          setUser(decoded);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Token inválido", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setUser(decoded);
      localStorage.setItem("jwt", newToken);
    } catch (err) {
      console.error("JWT inválido", err);
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
};

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }
  return context;
}
