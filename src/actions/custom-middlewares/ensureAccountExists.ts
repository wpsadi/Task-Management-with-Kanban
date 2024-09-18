import { prisma } from "@/prisma/prisma";
import { ensureLoggedIn } from "./ensureLoggedIn";
import httpError from "http-errors";

export const ensureAccountExists = async () => {
    const accountPayload = await ensureLoggedIn();

    const userId = accountPayload.accountId;

    const accountInfo = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select:{
            id:true
        }
    }).catch(() => {
        throw new httpError.Unauthorized("Account Not Found");
    });

    if (!accountInfo) {
        throw new httpError.Unauthorized("Account Not Found");
    }

    return accountInfo;


}