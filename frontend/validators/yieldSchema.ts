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
    z.number().positive("Weight must be positive").nullable()
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
    z.number().positive("Total weight must be positive").nullable()
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

