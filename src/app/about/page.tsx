"use client";

import { useGetUserQuery } from "@/store/services/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRefreshToken } from "@/hooks/useRefreshToken";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
      toast.error("Failed to fetch user data. Please log in again.");
      router.push("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Information about the application</CardDescription>
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
            <Button variant="outline" onClick={() => router.push("/profile")}>
              Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
