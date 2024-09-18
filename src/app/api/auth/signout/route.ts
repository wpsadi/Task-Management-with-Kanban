import {  NextResponse } from "next/server";


import {  removeCookie } from "@/actions/authActions/helpers/cookies";

export const GET = async ()=>{
    try{

        

        // removing the cookie
        await removeCookie()


        return NextResponse.json({
            success:true,
            message: "Signed out successfully",
        })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(e:any ){
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