import { prisma } from "@/prisma/prisma";
import { ensureAccountExists } from "../custom-middlewares/ensureAccountExists";
import httpError from "http-errors";

interface IncomingData{
    taskId:string,
}


export const deleteNewTask = async (data:IncomingData) =>{




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

    const updatedTask = await prisma.tasks.delete({
        where:{
            id:data.taskId,
            userId
        }
        // select:{} // we don't need to return anything
    });






    return updatedTask;



    
}