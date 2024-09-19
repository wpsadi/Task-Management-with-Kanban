import { NextRequest, NextResponse } from "next/server";
import httpError, { HttpError } from "http-errors"
import { signin } from "@/actions/authActions/signin";
import { createAuthToken } from "@/actions/authActions/helpers/jwt";
import { createCookie } from "@/actions/authActions/helpers/cookies";

export const POST = async (req:NextRequest)=>{
    try{

        const body = await req.json().catch(()=>{throw new httpError.BadRequest("Invalid JSON")})

        if (!body){
            throw new httpError.BadRequest("data required!")
        }
        // throw new httpError.NotAcceptable("ok")

        // passing data in signinAction
        const userData = await signin(body)

        const userID = userData.id

        // creating a token
        const token = await createAuthToken({accountId:userID})

        // setting the cookie
        await createCookie(token)


        return NextResponse.json({
            success:true,
            name:userData.name,
            message: "Signed in successfully",
        })

        
    }catch(error){
        const e = error as HttpError;
        // error will always be some http, thats how everything is written
        return NextResponse.json({
            success:false,
            error: e?.name || "Some Error",
            message: e?.message || "No description Provided"
        },{
            status:e?.statusCode || 500
        })
    }
}