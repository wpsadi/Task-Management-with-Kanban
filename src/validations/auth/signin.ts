import { z } from "zod";
import { passwordSchema } from "./password";
import { emailVal } from "./email";


export const dataVal = z.object({
  email: emailVal,
  password: passwordSchema,
});
