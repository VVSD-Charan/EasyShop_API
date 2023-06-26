import e from "express";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req , res , next) =>
{
    const token = getTokenFromHeader(req);
    const decodeUser = verifyToken(token);

    if(!decodeUser)
    {
        throw new Error("Invalid / expired authentication. Please login again");
    }
    else
    {
        req.userAuthId = decodeUser?.id;
        next();
    }
}