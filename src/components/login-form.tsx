"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/store/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { User } from "./register-form";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate just this field
    if (name === "email" || name === "password") {
      // ensure we only validate fields that exist in schema
      const fieldSchema = z.object({
        [name]: loginSchema.shape[name],
      });

      // Rest of the validation logic...
      const result = fieldSchema.safeParse({ [name]: value });

      if (result.success) {
        // Clear error for this field if validation passes
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        // Update error for this field if validation fails
        const fieldError = result.error.flatten().fieldErrors[name]?.[0] || "";
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        // Convert Zod errors into a more usable format
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0] || "",
          password: fieldErrors.password?.[0] || "",
        });
        toast.error(result.error.flatten().fieldErrors.email?.[0] || "");
        return;
      }

      setErrors({});
      const response = await login(formData).unwrap();

      if (response.status === 200) {
        toast.success(response.message);
        localStorage.setItem("accessToken", response.user.accessToken);
        localStorage.setItem("refreshToken", response.user.refreshToken);
        localStorage.setItem("expiresIn", response.user.expiresIn.toString());
        localStorage.setItem("userId", response.user.id);
        router.push("/profile");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-center">
              <Link
                href="/register"
                className="text-sm text-blue-500 hover:underline"
              >
                Don't have an account? Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
