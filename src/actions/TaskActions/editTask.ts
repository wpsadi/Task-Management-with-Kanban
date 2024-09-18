import { prisma } from "@/prisma/prisma";
import { ensureAccountExists } from "../custom-middlewares/ensureAccountExists";
import httpError from "http-errors";

interface IncomingData{
    taskId:string,
    title:string,
    description:string,
    priority:"low"|"medium"|"high",
    status : "todo"|"in_progress"|"completed",
    dueDate?:string
}


export const EditTask = async (data:IncomingData) =>{

    // enusre the taskId exists
    if (!data.taskId) {
        throw new httpError.BadRequest("Task Id is required");
    }


    const accountPayload = await ensureAccountExists();

    const userId = accountPayload.id;

    const task = await prisma.tasks.findUnique({
        where:{
            id:data.taskId,
            userId
        },
        select:{
            id:true
        }
        
    }).catch(()=>{throw new httpError.NotFound("Task Not Found")});

    if (!task) {
        throw new httpError.NotFound("Task Not Found");
    }

    // updating the task

    const updateData = {
        title:data.title,
        description:data.description,
        status:data.status,
        priority:data.priority,
        dueDate:data.dueDate || null,
    }

    const updatedTask = await prisma.tasks.update({
        where:{
            id:data.taskId,
            userId
        },
        data:updateData,
        select:{
            id:true,
            title:true,
            description:true,
            status:true,
            priority:true,
            dueDate:true,
        }
    });






    return updatedTask;



    
}