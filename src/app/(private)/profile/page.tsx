"use client";

import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

export default function Profile() {
  const { userData, handleLogout, isLoading } = useAuth();
  console.log(userData);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <ProtectedRoute>
      <div className="container h-screen flex items-center justify-center mx-auto p-6">
        <Card className="w-full max-w-md flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Welcome to your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="text-lg font-bold mb-4">
              <span className="text-gray-500">Name:</span> {userData.name}
            </h4>
            <h4 className="text-lg font-bold mb-4">
              <span className="text-gray-500">Email:</span> {userData.email}
            </h4>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogout}>Logout</Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
