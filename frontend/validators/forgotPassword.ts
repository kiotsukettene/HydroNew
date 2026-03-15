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
    password: z.string()
      .min(1, "Password is required")
      .superRefine((val, ctx) => {
        if (val.length > 0 && val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least 8 characters",
          });
        }
        if (val.length >= 8) {
          if (!/[A-Z]/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one uppercase letter",
            });
          }
          if (!/[a-z]/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one lowercase letter",
            });
          }
          if (!/[0-9]/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one number",
            });
          }
          if (!/[^A-Za-z0-9]/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one special character",
            });
          }
        }
      }),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ['confirm_password'],
  });