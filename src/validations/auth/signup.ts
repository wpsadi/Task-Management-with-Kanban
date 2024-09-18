import { z } from "zod";
import { nameSchema } from "./name";
import { emailVal } from "./email";
import { passwordSchema } from "./password";

export const dataVal = z.object({
  email: emailVal,
  password: passwordSchema,
  fullName: nameSchema,
});
