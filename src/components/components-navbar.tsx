'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            KanbanFlow
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}