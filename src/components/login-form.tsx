"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLoginMutation } from "@/store/services/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"
import { User } from "./register-form"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [login] = useLoginMutation()
  const router = useRouter()

  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate just this field
    if (name === 'email' || name === 'password') {  // ensure we only validate fields that exist in schema
      const fieldSchema = z.object({
        [name]: loginSchema.shape[name]
      });

      // Rest of the validation logic...
      const result = fieldSchema.safeParse({ [name]: value });
      
      if (result.success) {
        // Clear error for this field if validation passes
        setErrors(prev => ({ ...prev, [name]: "" }));
      } else {
        // Update error for this field if validation fails
        const fieldError = result.error.flatten().fieldErrors[name]?.[0] || "";
        setErrors(prev => ({ ...prev, [name]: fieldError }));
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = loginSchema.safeParse(formData)
      if (!result.success) {
        // Convert Zod errors into a more usable format
        const fieldErrors = result.error.flatten().fieldErrors
        setErrors({
          email: fieldErrors.email?.[0] || "",
          password: fieldErrors.password?.[0] || "",
        })
        toast.error(result.error.flatten().fieldErrors.email?.[0] || "")
        return
      }
      
      setErrors({})
      const response = await login(formData).unwrap()

      if (response.status === 200) {
        toast.success(response.message)
        localStorage.setItem("accessToken", response.user.accessToken)
        localStorage.setItem("refreshToken", response.user.refreshToken)
        localStorage.setItem("userId", response.user.id)
        router.push("/profile")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration. Please try again.')
    }
  }
  
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required name="password" value={formData.password} onChange={handleChange} />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
