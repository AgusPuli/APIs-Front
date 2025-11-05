import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [sharedEmail, setSharedEmail] = useState("");

  return (
    <AuthContext.Provider value={{ sharedEmail, setSharedEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
