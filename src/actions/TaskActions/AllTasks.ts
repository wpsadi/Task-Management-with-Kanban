import { prisma } from "@/prisma/prisma";
import { ensureAccountExists } from "../custom-middlewares/ensureAccountExists";

export const ListAllTasks = async () =>{
    const accountPayload = await ensureAccountExists();

    const userId = accountPayload.id;
    // console.log(userId);

    const tasks = await prisma.tasks.findMany({
        where:{
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


    return tasks;



    
}