import { prisma } from "@/prisma/prisma";
import { ensureAccountExists } from "../custom-middlewares/ensureAccountExists";
import { taskSchema } from "@/validations/task/task";
import httpError from "http-errors";

interface IncomingData{
    title:string,
    description:string,
    priority:"low"|"medium"|"high",
    status : "todo"|"in_progress"|"completed",
    dueDate?:string
}


export const CreateNewTask = async (data:IncomingData) =>{

    // validating data
    const validatedData = taskSchema.safeParse(data);

    if (!validatedData.success) {
        throw new httpError.BadRequest(validatedData.error.errors[0].message);
    }



    const accountPayload = await ensureAccountExists();

    const userId = accountPayload.id;

    const task = await prisma.tasks.create({
        
        data:{

            title:data.title,
            description:data.title,
            status:data.status,
            priority:data.priority,
            dueDate:data.dueDate || null,
            userId
        },
        select:{
            id:true,
            title:true,
            description:true,
            status:true,
            priority:true,
            dueDate:true,
        }
    });


    return task;



    
}