
import { NextRequest, NextResponse } from "next/server";
import httpError, { HttpError } from "http-errors"
import { deleteNewTask } from "@/actions/TaskActions/deleteTask";
export const DELETE = async (req:NextRequest)=>{
    try{

        const body = await req.json().catch(()=>{throw new httpError.BadRequest("Invalid JSON")})

        if (!body){
            throw new httpError.BadRequest("data required!")
        }
        // throw new httpError.NotAcceptable("ok")

        // passing data 
        await deleteNewTask({
            taskId:body.taskId
        })



        return NextResponse.json({
            success:true,
            message: "Task deleted successfully",
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