import { prisma } from "@/prisma/prisma";
import { dataVal } from "@/validations/auth/signup";
import httpError from "http-errors"
import bcrypt from "bcryptjs"
interface IncomingData{
    name: string
    email: string
    password: string
}
interface ReturnData  {
    
    id:string,
    email:string,
    name:string,
    password:string

}


export const signup = async (data:IncomingData):Promise<ReturnData>=>{
    const {email,password} = data;

    if (!email || !password || !data.name) {
        throw new httpError.NotFound("Email and password are required")
    }

    // console.log(data)
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

    // encrypting password
    const hashedPassword = await bcrypt.hash(validateData.data.password,10)

    // creating new Account
    const user = await prisma.user.create({
        data:{
            email : validateData.data.email,
            name : validateData.data.name,
            password : hashedPassword
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((e:any)=>{throw new httpError.BadRequest(e?.message || "failed to create account")})



    // removing password
    user.password = "********"

    return user


}