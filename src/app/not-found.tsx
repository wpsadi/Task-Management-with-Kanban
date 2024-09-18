import Link from 'next/link'
import { Button } from "@/components/ui/button"

import { FileQuestion } from 'lucide-react'
import { Navbar } from '@/components/components-navbar'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileQuestion className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
          <p className="mt-4 text-base text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">
                Go back home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}