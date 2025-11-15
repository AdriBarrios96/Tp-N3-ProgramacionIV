import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null); 
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState(null);

  const login = async (username, password) => { 
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        console.error("Error 400 desde el backend:", session); // NUEVO
      
        const errorMessage = session.error || session.message || "Error desconocido";
        
        throw new Error(errorMessage);
      }

      setToken(session.token);
      setUsername(session.nombre); 
      setRoles([]); 
      return { success: true };
    } catch (err) {
      console.error("Error en la función de login:", err); // NUEVO
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRoles(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        roles,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <article>
        <h2>Acceso Denegado</h2>
        <p>Por favor, ingrese para ver esta página.</p>
      </article>
    );
  }

  return children;
};

export const AuthRol = ({ rol, children }) => {
  return children;
};
