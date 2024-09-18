import { z } from "zod";

export const nameSchema = z.string()
  .min(2, "Full name must be at least 2 characters long")
  .max(50, "Full name must be at most 50 characters long")
  .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes");


