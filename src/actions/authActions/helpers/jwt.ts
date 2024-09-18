import { env } from "@/env";
import JWT from "jsonwebtoken";
import httpError from "http-errors";
interface  IncomingData{
    accountId:string
}


export const createAuthToken = (data:IncomingData)=>{
    return JWT.sign(
        data,env.auth.jwt.secret,{
            expiresIn:env.auth.jwt.expiresIn
        }
    )
}

export const verifyAuthToken =  (token:string):IncomingData=>{
    try{
        return JWT.verify(token,env.auth.jwt.secret) as IncomingData
    }catch(e:any){
        throw new httpError.Unauthorized(e.message || "Invalid Auth Token")
    }
}