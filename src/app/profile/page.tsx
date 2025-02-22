"use client";

import { useGetUserQuery } from "@/store/services/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRefreshToken } from "@/hooks/useRefreshToken";

export default function ProfilePage() {
  const { data, error, isLoading } = useGetUserQuery();
  const router = useRouter();
  useRefreshToken();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiresIn");
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  useEffect(() => {
    if (error) {
      if ("status" in error && error.status === 401) {
        toast.error("Login failed. Please log in again.");
        router.push("/login");
      }
    }
  }, [error,router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Welcome to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="text-lg font-bold mb-4">
            <span className="text-gray-500">Name:</span> {data?.user.name}
          </h4>
          <h4 className="text-lg font-bold mb-4">
            <span className="text-gray-500">Email:</span> {data?.user.email}
          </h4>
          <div className="flex justify-between">
            <Button onClick={handleLogout}>Logout</Button>
            <Button variant="outline" onClick={() => router.push("/about")}>
              About
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
