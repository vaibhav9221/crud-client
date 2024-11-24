"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial loading state

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setUser({ token }); // Set user if token exists
    }
    setLoading(false); // Set loading to false once the token is checked
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 1 }); // Store token for 1 day
    setUser({ token });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
