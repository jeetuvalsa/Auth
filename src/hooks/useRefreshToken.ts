"use client";

import { useEffect } from "react";
import { useRefreshTokenMutation } from "@/store/services/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

export function useRefreshToken() {
  const [refreshToken] = useRefreshTokenMutation();
  const router = useRouter();

  const handleTokenRefresh = async () => {
    try {
      const result = await refreshToken().unwrap();
      if (result.status === 200) {
        localStorage.setItem("accessToken", result.user.accessToken);
        localStorage.setItem("refreshToken", result.user.refreshToken);
        localStorage.setItem("expiresIn", result.user.expiresIn.toString());
        return true;
      }
      return false;
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return false;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (refreshTokenValue) {
        handleTokenRefresh();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return { handleTokenRefresh };
}
