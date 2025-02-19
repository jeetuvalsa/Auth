"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  useGetUserQuery,
  useRefreshTokenMutation,
} from "@/store/services/auth";
import { toast } from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  userData: any;
  handleLogout: () => void;
  isLoading: boolean;
}

const REFRESH_INTERVAL = 15 * 1000; // 15 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, isLoading, error: userError } = useGetUserQuery();
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (!isLoading && !data?.user) {
      handleLogout();
    }
  }, [data, isLoading]);

  const handleTokenRefresh = async () => {
    try {
      console.log("Attempting token refresh at:", new Date().toISOString());
      const result = await refreshToken().unwrap();
      if (result.status === 200) {
        console.log("Token refresh successful");
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("expiresIn", result.expiresIn.toString());
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout();
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Effect for initial authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshTokenValue = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshTokenValue) {
        handleLogout();
        return;
      }

      if (!accessToken && refreshTokenValue) {
        const refreshSuccess = await handleTokenRefresh();
        if (!refreshSuccess) {
          handleLogout();
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Effect for token refresh interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAuthenticated) {
      // Initial refresh
      handleTokenRefresh();

      // Set up interval for subsequent refreshes
      intervalId = setInterval(() => {
        handleTokenRefresh();
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  // Effect for handling 401 errors
  useEffect(() => {
    if (userError && "status" in userError && userError.status === 401) {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (refreshTokenValue) {
        handleTokenRefresh();
      } else {
        handleLogout();
      }
    }
  }, [userError]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData: data?.user,
        handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
