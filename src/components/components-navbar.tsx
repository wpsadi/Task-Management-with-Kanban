'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'

export function Navbar() {
  const { toast } = useToast()
  const {isLoggedIn,signout}= useAuthStore()
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            KanbanFlow
          </Link>
          <div className="space-x-4">
           
            
            {isLoggedIn && (<>
              <Button variant="outline" asChild>
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={async ()=>{
                // sign out
                toast({
                  title:"Initiating Sign Out"
                })
                const result = await signout()

                if(result?.error){
                  toast({
                    title:"Sign Out Failed",
                    description:result!.error
                  })}else{
                    toast({
                      title:"Sign Out Success",
                      description:"You have been signed out"})
                  }
                
                
                
              }} >
              Sign Out
            </Button>
            </>)}

            {!isLoggedIn && (<>
              <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            </>)}
           
          </div>
        </div>
      </div>
    </nav>
  )
}