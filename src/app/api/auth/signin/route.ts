import { NextRequest, NextResponse } from "next/server";
import httpError,{HttpError } from "http-errors"

export const POST = async (req:NextRequest)=>{
    try{

        // const body = await req.json();
        // throw new httpError.NotAcceptable("ok")



        return NextResponse.json({
            success:true,
            data:{}
        })

    }catch(e:any){
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