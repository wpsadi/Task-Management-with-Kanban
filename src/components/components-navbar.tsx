"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import { MenuIcon, XIcon } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()
  const { isLoggedIn, signout } = useAuthStore()

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          KanbanFlow
        </Link>
        
        <div className="hidden lg:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/tasks">Tasks</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={async () => {
                toast({
                  title: "Initiating Sign Out"
                })
                const result = await signout()

                if (result?.error) {
                  toast({
                    title: "Sign Out Failed",
                    description: result!.error
                  })
                } else {
                  toast({
                    title: "Sign Out Success",
                    description: "You have been signed out"
                  })
                }
              }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-gray-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 lg:hidden transform transition-transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} z-40`}
      >
        <div className="flex flex-col p-4 space-y-4 bg-white h-full relative z-50">
          <Button
            variant="outline"
            className="self-end p-2 text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
          {isLoggedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/tasks">Tasks</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={async () => {
                toast({
                  title: "Initiating Sign Out"
                })
                const result = await signout()

                if (result?.error) {
                  toast({
                    title: "Sign Out Failed",
                    description: result!.error
                  })
                } else {
                  toast({
                    title: "Sign Out Success",
                    description: "You have been signed out"
                  })
                }
              }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
