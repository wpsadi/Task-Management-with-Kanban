import { z } from "zod";

export const emailVal = z.string().email("Invalid email address");
