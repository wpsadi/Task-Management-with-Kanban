export const env = {
    auth:{
        jwt:{
            secret : String(process.env.JWT_SECRET),
            expiresIn : String(process.env.JWT_EXPIRES_IN)
        },
        cookie:{
            maxAge:Number(process.env.AuthCookieMaxAge)
        }
    }
}