import { prisma } from "@/prisma/prisma";
import { verifyAuthToken } from "./helpers/jwt";
import httpError from "http-errors";
interface IncomingData{
    token:string
}

interface ReturnData  {
    
    id:string,
    email:string,
    name:string,
    password:string

}

export const currentUser = async (data:IncomingData):Promise<ReturnData>=>{
    const token = data.token;
    
    const payload = verifyAuthToken(token)

    // console.log(payload)

    const user = await prisma.user.findFirst({
        where:{
            id:payload.accountId
        },
        select:{
            id:true,
            email:true,
            name:true
        }
    }).catch((e)=>{
        const error = e as Error
        throw new httpError.NotFound(error.message || "User not found")})

    if (!user) {
        throw new httpError.NotFound("User not found")}

     user.id = "$$$$$"
    return {...user,password:"********"} as ReturnData
}

