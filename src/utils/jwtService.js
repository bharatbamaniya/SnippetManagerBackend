import jwt from "jsonwebtoken";
import {config} from "dotenv";

config();

export const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRY || "1d";
    const options = {expiresIn};

    return jwt.sign(payload, secret, options);
};

export const verifyToken = (token) => {
    if (!token) throw new Error("Token not found to verify");

    return jwt.verify(token, process.env.JWT_SECRET);
};
