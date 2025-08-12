import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const SignupSchema = z.object({
  name: z
    .string()
    .min(3, "Name is too short")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, or _ only"),
  email: z.string().email("Enter a valid email"),
});

export const ForgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return emailRegex.test(val) || usernameRegex.test(val);
      },
      {
        message: "Enter a valid email or username",
      }
    ),
});

export const passwordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name is too short")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, or _ only"),
  country: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  bannerImage: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const phoneFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^\+?[0-9]+$/, "Only numbers and + prefix allowed")
});

export type LoginFormInputs = z.infer<typeof LoginSchema>;
export type SignupFormInputs = z.infer<typeof SignupSchema>;
export type PhoneFormInputs = z.infer<typeof phoneFormSchema>;
export type PasswordFormInput = z.infer<typeof passwordSchema>;
export type ForgotPasswordFormInputs = z.infer<typeof ForgotPasswordSchema>;
export type UpdateProfileFormInputs = z.infer<typeof updateProfileSchema>;
