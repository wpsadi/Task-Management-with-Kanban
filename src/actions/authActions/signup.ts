import { prisma } from "@/prisma/prisma";
import { dataVal } from "@/validations/auth/signup";
import httpError from "http-errors"
interface IncomingData{
    name: string
    email: string
    password: string
}

export const signup = async (data:IncomingData)=>{
    const {email,password} = data;

    if (!email || !password || !data.name) {
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
        }
    })

    if (searchAccount?.id) {
        throw new httpError.Conflict("Account already exists")
    }

    // creating new Account
    const user = await prisma.user.create({
        data:{
            email : validateData.data.email,
            name : validateData.data.fullName,
            password : validateData.data.password
        }
    }).catch(e=>{throw new httpError.BadRequest(e.message || "failed to create account")})



    // removing password
    user.password = "********"

    return user


}