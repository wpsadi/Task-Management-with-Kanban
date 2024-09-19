import { NextResponse } from "next/server";

import {  getCookie } from "@/actions/authActions/helpers/cookies";
import { currentUser } from "@/actions/authActions/currentUser";
import { HttpError } from "http-errors";

export const GET = async ()=>{
    try{

        const authCookie = await getCookie();

        // passing cookie for verification
        const user = await currentUser({token:authCookie.value})

        



        return NextResponse.json({
            success:true,
            message: "User Found",
            data: user
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