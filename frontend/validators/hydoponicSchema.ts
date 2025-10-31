import { z } from "zod";

export const hydroponicSchema = z
  .object({
    crop_name: z.string().min(1, "Crop name is required"),

    number_of_crops: z.coerce
      .number()
      .min(1, "Number of crops must be a positive number"),

    bed_size: z.enum(["small", "medium", "large"], {
      required_error: "Bed size is required",
    }),

    nutrient_solution: z.string().nullable().optional(),

    target_ph_min: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "Target pH minimum is required",
          invalid_type_error: "Target pH minimum must be a number",
        })
        .min(1, "Target pH minimum must be a valid positive number")
    ),

    target_ph_max: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "Target pH maximum is required",
          invalid_type_error: "Target pH maximum must be a number",
        })
        .min(1, "Target pH maximum must be a valid positive number")
    ),

    target_tds_min: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "Target TDS minimum is required",
          invalid_type_error: "Target TDS minimum must be a number",
        })
        .min(1, "Target TDS minimum must be a valid positive number")
    ),

    target_tds_max: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "Target TDS maximum is required",
          invalid_type_error: "Target TDS maximum must be a number",
        })
        .min(1, "Target TDS maximum must be a valid positive number")
    ),

    water_amount: z
      .string()
      .min(1, "Water amount is required")
      .refine(
        (val) => {
          const num = parseFloat(val.replace(/L/i, "").trim());
          return !isNaN(num) && num > 0;
        },
        { message: "Water amount must be a valid positive number" }
      ),

    pump_config: z.any().optional(),
  })
  .refine(
    (data) =>
      typeof data.target_ph_min === "number" &&
      typeof data.target_ph_max === "number" &&
      data.target_ph_max >= data.target_ph_min,
    {
      message: "Target pH maximum must be greater than minimum",
      path: ["target_ph_max"],
    }
  )
  .refine(
    (data) =>
      typeof data.target_tds_min === "number" &&
      typeof data.target_tds_max === "number" &&
      data.target_tds_max >= data.target_tds_min,
    {
      message: "Target TDS maximum must be greater than minimum",
      path: ["target_tds_max"],
    }
  );
