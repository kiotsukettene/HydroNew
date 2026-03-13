import { z } from "zod";

export const yieldGradeSchema = z.object({
  grade: z.enum(["selling", "consumption"], {
    required_error: "Grade is required",
  }),
  count: z.coerce
    .number()
    .min(0, "Count must be 0 or greater"),
  weight: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().nonnegative("Weight must be 0 or greater").nullable()
  ),
});

export const yieldSchema = z.object({
  total_count: z.coerce
    .number()
    .min(0, "Total count must be 0 or greater"),
  total_weight: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().nonnegative("Total weight must be 0 or greater").nullable()
  ),
  notes: z.preprocess(
    (val) => (val === '' || val === undefined ? null : val),
    z.string().max(1000, "Notes must not exceed 1000 characters").nullable()
  ),
  grades: z
    .array(yieldGradeSchema)
    .min(1, "At least one grade entry is required"),
}).refine(
  (data) => {
    const gradesSum = data.grades.reduce((sum, grade) => sum + grade.count, 0);
    return gradesSum === data.total_count;
  },
  {
    message: "The sum of grades counts must equal the total count",
    path: ["grades"],
  }
);

export type YieldFormData = z.infer<typeof yieldSchema>;

/**
 * Maps backend validation errors (Laravel format) to form field errors
 * 
 * @param err - The error object from the API response
 * @returns Object containing field names as keys and error messages as values
 */
export const mapBackendErrors = (err: unknown): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Handle backend validation errors (Laravel format)
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as any).response;
    
    if (response?.data?.errors) {
      const errorData = response.data.errors;
      
      // Map Laravel validation errors to form fields
      Object.keys(errorData).forEach((key) => {
        const errorMessages = errorData[key];
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          errors[key] = errorMessages[0];
        }
      });
    }
  }

  return errors;
};

/**
 * Gets the error message from a backend response
 * 
 * @param err - The error object from the API response
 * @returns The error message string or null
 */
export const getBackendErrorMessage = (err: unknown): string | null => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as any).response;
    return response?.data?.message || null;
  }
  
  if (err instanceof Error) {
    return err.message;
  }
  
  return null;
};

/**
 * Checks if the error is a backend validation error
 * 
 * @param err - The error object from the API response
 * @returns True if the error contains backend validation errors
 */
export const isBackendValidationError = (err: unknown): boolean => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as any).response;
    return !!response?.data?.errors;
  }
  return false;
};
