import { decodeJwt } from "../utils/utils.js";
import apiError from "../utils/apiError.js";
import TokenExpiredError from "jsonwebtoken/lib/TokenExpiredError.js";

export const jwtAuthMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).send(apiError(401, "Unauthorized request, token not found!"));
        }

        const token = authorizationHeader.split(" ")[1]; // Remove "Bearer"
        const payload = decodeJwt(token);

        if (!payload || !payload.userId) {
            return res.status(401).send(apiError(401, "Unauthorized request, User id not found in token!"));
        }

        req.userId = payload.userId;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send(apiError(401, "Session Expired, Please log in again."));
        }
        return res.status(401).send(apiError(401, "Unauthorized request, token not found!"));
    }
};
