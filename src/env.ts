export const env = {
    baseURL: String(process.env.NEXT_PUBLIC_BASE_URL),
    auth:{
        jwt:{
            secret : String(process.env.JWT_SECRET),
            expiresIn : String(process.env.JWT_EXPIRES_IN)
        },
        cookie:{
            maxAge:Number(eval(String(process.env.AuthCookieMaxAge)))
        }
    }
}