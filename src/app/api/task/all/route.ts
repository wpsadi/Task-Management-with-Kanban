import { ListAllTasks } from "@/actions/TaskActions/AllTasks"
import { NextResponse } from "next/server"

export const GET = async ()=>{
    try{

        const allTask =  await ListAllTasks()


        return NextResponse.json({
            success:true,
            data:allTask,
            message: "Tasks fetched successfully",
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