import { prisma } from "@/prisma/prisma";
import { verifyAuthToken } from "./helpers/jwt";

interface IncomingData{
    token:string
}

export const currentUser = async (data:IncomingData)=>{
    const token = data.token;
    
    const payload = verifyAuthToken(token)

    const user = await prisma.user.findFirst({
        where:{
            id:payload.accountId
        },
        select:{
            id:true,
            email:true,
            name:true
        }
    })

    return user
}

