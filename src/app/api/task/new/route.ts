import { CreateNewTask } from "@/actions/TaskActions/CreateNewtask";
import { NextRequest, NextResponse } from "next/server";
import httpError from "http-errors"
export const POST = async (req:NextRequest)=>{
    try{

        const body = await req.json().catch(()=>{throw new httpError.BadRequest("Invalid JSON")})

        if (!body){
            throw new httpError.BadRequest("data required!")
        }
        // throw new httpError.NotAcceptable("ok")

        // passing data in createNewTask
        const newTask  = await CreateNewTask(body)

        return NextResponse.json({
            success:true,
            data:newTask,
            message: "Task created successfully",
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