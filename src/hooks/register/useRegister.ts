import { useRegisterMutation } from "@/store/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const useRegister = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({ name: "", email: "", password: "" });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof typeof errors;
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors as { name: string; email: string; password: string });
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
      const response = await register(formData).unwrap();
      if (response.status === 201) {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return { isLoading, formData, errors, handleChange, handleSubmit, showPassword, setShowPassword };
};

export default useRegister;
