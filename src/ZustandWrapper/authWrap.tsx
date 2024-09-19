"use client";
import { useAuthStore } from "@/store/authStore";
import { useEffect} from "react";

function AuthWrap() {
    const authStore = useAuthStore();
    
    useEffect(()=>{
        if (authStore.isLoggedIn==null){
            authStore.reinstate()
        }
        
    },[])
    return null
}

export default AuthWrap