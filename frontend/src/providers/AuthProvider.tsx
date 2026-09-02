"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserResponse, authService } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (err: unknown) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      // Let the protected routes handle redirection, or force it here:
      if (pathname !== "/" && pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
        router.push("/login");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
