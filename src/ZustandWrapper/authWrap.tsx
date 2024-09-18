"use client";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

function AuthWrap() {
    const authStore = useAuthStore();
    const [once, setOnce] = useState(false);
    useEffect(()=>{
        if(!once){
            authStore.reinstate()
            setOnce(true)
        }
    },[])
    return null
}

export default AuthWrap