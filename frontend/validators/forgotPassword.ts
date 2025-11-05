import {z} from 'zod';

export const forgotPasswordSchema = z.object({
    email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

export const verifyResetCodeSchema = z.object({
    code: z.string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Invalid code'),
});

export const createNewPasswordSchema = z
  .object({
    password: z.string().nonempty("Password is required")
      .min(8, "At least 8 characters")
      .refine((val) => /[A-Z]/.test(val), 'At least one uppercase letter')
      .refine((val) => /[a-z]/.test(val), 'At least one lowercase letter')
      .refine((val) => /[0-9]/.test(val), 'At least one number')
      .refine((val) => /[^A-Za-z0-9]/.test(val), 'At least one special character'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ['confirm_password'],
  });