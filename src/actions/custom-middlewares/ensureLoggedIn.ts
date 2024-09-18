import { getCookie } from "../authActions/helpers/cookies";
import httError from "http-errors";
import { verifyAuthToken } from "../authActions/helpers/jwt";
export const ensureLoggedIn = async () => {
    const authCookie = await getCookie();
    if (!authCookie) {
        throw new httError.Unauthorized("Not Logged In");
    }

    // verify the token
    const tokenData = verifyAuthToken(authCookie.value);

    return tokenData;

}

