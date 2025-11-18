import { ZodSchema } from "zod";
import { ERROR_MESSAGES, ValidationError } from "art-chain-shared";

export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const validationErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new ValidationError(
      ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors
    );
  }

  return result.data;
}
