import { z } from "zod";

export const accountSchema = z.object ({

    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
});


export const changePasswordSchema = z.object({
    current_password: z.string().min(1, "Old password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    new_password_confirmation: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
});