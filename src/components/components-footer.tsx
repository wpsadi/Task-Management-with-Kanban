'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-700 mb-4 md:mb-0">
            © 2023 KanbanFlow. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-800">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-800">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}