'use server'
 
import { env } from '@/env'
import { cookies } from 'next/headers'
 
export async function createCookie(token:string) {
  cookies().set({
    name: 'auth',
    value: token,
    httpOnly: true,
    maxAge:env.auth.cookie.maxAge
    // path: '/',
  })
}

export async function removeCookie(){
  cookies().delete('auth')
}