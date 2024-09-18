"use client"
import { Navbar } from "@/components/components-navbar";
import { ErrorPage } from "@/components/error";
import { LoadingPage } from "@/components/loading";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskDataStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }:{
    children: React.ReactNode
}) {
    const router = useRouter();
    const authStore = useAuthStore();
    const taskStore = useTaskStore();
    useEffect(()=>{
        // console.log(authStore.isLoggedIn)
        if(authStore.isLoggedIn === false){
            // console.log("Redirecting to Sign In",)
            router.push("/signin")
        }
    },[authStore.isLoggedIn])

    const [dataFetched, setDataFetched] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        if (authStore.isLoggedIn){
            setError("")
            taskStore.getAllTasks().then(()=>{
                // console.log(taskStore.taskData)
                // throw new Error("Some Error Occurred")
            }).catch((e)=>{
                setError(e?.error || "Some Error Occurred")
            }).finally(()=>{
                setDataFetched(true)
            })
        }
    },[authStore.accountLoading])
    return (
        <>
            <div className="sticky top-0">
                <Navbar/>
            </div>
            {/* {authStore.accountLoading ? <LoadingPage text="Checking User"/>  : <LoadingPage text="Redirecting to Sign In"/>} */}
            {authStore.isLoggedIn ? dataFetched ? error=="" ? children : <ErrorPage text={error}/> :<LoadingPage text="Loading your data..."/> : authStore.isLoggedIn === false ? <LoadingPage text="Redirecting to Sign In"/> : <LoadingPage text="Checking User"/>}
            
        </>
    );
}