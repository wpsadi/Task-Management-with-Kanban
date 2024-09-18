import { prisma } from "@/prisma/prisma";
import { dataVal } from "@/validations/auth/signin";
import httpError from "http-errors"
import bcrypt from "bcryptjs"
interface IncomingData{
    email: string
    password: string
}

interface ReturnData  {
    
    id:string,
        email:string,
        name:string,
        password:string
    
}


export const signin = async (data:IncomingData):Promise<ReturnData>=>{
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

    // verifying password
    const isPasswordValid = await bcrypt.compare(validateData.data.password,searchAccount.password)

    if (!isPasswordValid) {
        throw new httpError.Unauthorized("Invalid password")
    }

    // removing password
    searchAccount.password = "********"

 

    return searchAccount


}