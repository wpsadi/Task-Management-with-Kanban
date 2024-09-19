import { ListAllTasks } from "@/actions/TaskActions/AllTasks"
import { HttpError } from "http-errors"
import { NextResponse } from "next/server"

export const GET = async ()=>{
    try{

        const allTask =  await ListAllTasks()


        return NextResponse.json({
            success:true,
            data:allTask,
            message: "Tasks fetched successfully",
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