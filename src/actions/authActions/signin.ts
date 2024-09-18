import { prisma } from "@/prisma/prisma";
import { dataVal } from "@/validations/auth/signin";
import httpError from "http-errors"
interface IncomingData{
    email: string
    password: string
}

export const signin = async (data:IncomingData)=>{
    const {email,password} = data;

    if (!email || !password) {
        throw new httpError.NotFound   ("Email and password are required")
    }

    const validateData = dataVal.safeParse(data);

    if (!validateData.success){
        const errorMsg = validateData.error?.issues[0]?.message || "Unknown error";
        throw new httpError.ExpectationFailed(errorMsg)
    }

    const searchAccount = await prisma.user.findFirst({
        where:{
            email:validateData.data.email
        },
        select:{
            id:true,
            email:true,
            name:true,
            password:true
        }
    })

    if (!searchAccount) {
        throw new httpError.NotFound("Account not found")
    }

    if (searchAccount.password != validateData.data.password) {
        throw new httpError.Unauthorized("Invalid password")
    }

    // removing password
    searchAccount.password = "********"

    return searchAccount


}