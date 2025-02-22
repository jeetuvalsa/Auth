import { useLoginMutation } from "@/store/services/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const useLogin = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({ email: "", password: "" });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof typeof errors;
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors as { email: string; password: string });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData).unwrap();
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.user.accessToken);
        localStorage.setItem("refreshToken", response.user.refreshToken);
        localStorage.setItem("expiresIn", response.user.expiresIn.toString());
        localStorage.setItem("userId", response.user.id);
        toast.success("Login successful!");
        window.location.href = "/profile";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return { login, isLoading, formData, errors, handleChange, handleSubmit, showPassword, setShowPassword };
};
