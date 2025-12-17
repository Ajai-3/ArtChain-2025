import { z } from "zod";

// UPI ID validation pattern
const UPI_ID_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

// IFSC Code validation
const IFSC_CODE_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Account number validation: 9-18 digits
const ACCOUNT_NUMBER_REGEX = /^[0-9]{9,18}$/;

// Account holder name: Only letters and spaces
const ACCOUNT_HOLDER_NAME_REGEX = /^[a-zA-Z\s]+$/;

export const createWithdrawalRequestSchema = z.object({
  amount: z
    .number()
    .min(100, "Minimum withdrawal amount is 100 AC")
    .max(1000000, "Maximum withdrawal amount is 1,000,000 AC")
    .positive("Amount must be positive"),
  
  method: z.enum(["BANK_TRANSFER", "UPI"]),
  
  // Bank Transfer Fields (conditional)
  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must not exceed 100 characters")
    .regex(ACCOUNT_HOLDER_NAME_REGEX, "Account holder name can only contain letters and spaces")
    .trim()
    .optional(),
  
  accountNumber: z
    .string()
    .regex(ACCOUNT_NUMBER_REGEX, "Account number must be 9-18 digits")
    .trim()
    .optional(),
  
  ifscCode: z
    .string()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(IFSC_CODE_REGEX, "Invalid IFSC code format (e.g., SBIN0001234)")
    .toUpperCase()
    .trim()
    .optional(),
  
  // UPI Field (conditional)
  upiId: z
    .string()
    .min(3, "UPI ID must be at least 3 characters")
    .max(100, "UPI ID must not exceed 100 characters")
    .regex(UPI_ID_REGEX, "Invalid UPI ID format (e.g., username@paytm)")
    .toLowerCase()
    .trim()
    .optional(),
}).superRefine((data, ctx) => {
  // Validate based on payment method
  if (data.method === "BANK_TRANSFER") {
    if (!data.accountHolderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account holder name is required for bank transfer",
        path: ["accountHolderName"],
      });
    }
    if (!data.accountNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account number is required for bank transfer",
        path: ["accountNumber"],
      });
    }
    if (!data.ifscCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "IFSC code is required for bank transfer",
        path: ["ifscCode"],
      });
    }
  } else if (data.method === "UPI") {
    if (!data.upiId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "UPI ID is required for UPI payment",
        path: ["upiId"],
      });
    }
  }
});
