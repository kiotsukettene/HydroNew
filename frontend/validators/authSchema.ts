import { z } from "zod";

export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  password_confirmation: z.string().min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});


export type LoginSchema = z.infer<typeof loginSchema>;