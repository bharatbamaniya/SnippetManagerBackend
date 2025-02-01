import apiError from "../utils/apiError.js";
import TokenExpiredError from "jsonwebtoken/lib/TokenExpiredError.js";
import {verifyToken} from "../utils/jwtService.js";

export const jwtAuthMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).send(apiError(401, "Unauthorized request, token not found!"));
        }

        const token = authorizationHeader && authorizationHeader.replace("Bearer ", ""); // Remove "Bearer"
        const payload = verifyToken(token);

        if (!payload || !payload._id) {
            return res.status(401).send(apiError(401, "Unauthorized request, User id not found in token!"));
        }

        req.user = {_id: payload._id};
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send(apiError(401, "Session Expired, Please log in again."));
        }
        return res.status(401).send(apiError(401, "Unauthorized request, token not found!"));
    }
};
