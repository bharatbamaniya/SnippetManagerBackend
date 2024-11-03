import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * @param userId
 * @returns {string}
 */
export function generateJwt(userId) {
    const payload = {
        userId,
    };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "4h" });
}

/**
 * @param jwtToken {string}
 * @returns {*}
 */
export function decodeJwt(jwtToken) {
    return jwt.verify(jwtToken, config.JWT_SECRET);
}

/**
 * @param utcDate {number}
 * @returns {Date}
 */
export function convertUTCToIST(utcDate) {
    // Create a Date object from the UTC date
    const date = new Date(utcDate);

    // Calculate the time offset between UTC and IST (5.5 hours)
    const offset = 5.5 * 60 * 60 * 1000;

    // Add the offset to the UTC time to get IST
    const istTimestamp = date.getTime() + offset;

    // Create a new Date object in IST
    return new Date(istTimestamp);
}
