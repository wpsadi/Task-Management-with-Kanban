import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must be less than 100 characters." }),
  
  description: z.string()
    .min(1, { message: "Description is required." })
    .max(1000, { message: "Description must be less than 1000 characters." }),
  
  status: z.enum(["todo", "in_progress", "done"], {
    errorMap: () => ({ message: "Status must be one of 'todo', 'in_progress', or 'done'." })
  }),
  
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Priority must be 'low', 'medium', or 'high'." })
  }),
  
  dueDate: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: "Due date must be a valid date." }
  ).optional(),
});
