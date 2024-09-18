'use server'
 
import { env } from '@/env'
import { cookies } from 'next/headers'
import httpError from "http-errors"
 
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

export async function getCookie(){
  const authCookie = cookies().get('auth')
  if (!authCookie){
    throw new httpError.Unauthorized("No Auth Cookie")
  }
  return authCookie
}