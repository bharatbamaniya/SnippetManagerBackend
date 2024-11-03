import cors from "cors";
import helmet from "helmet";
import {logger} from "../utils/logger.js";

const hostName = process.env.HOSTNAME || "localhost";

const denyAllExceptWAFRequest = (req, res, next) => {
    let allowedIPList = process.env.ALLOWED_IP_LIST;
    const isLocalhost = (clientIP) => ["::ffff:127.0.0.1", "127.0.0.1", "::1"].includes(clientIP);
    let clientIP = req.ip || null;

    allowedIPList = allowedIPList ? allowedIPList.split(",") : null;
    clientIP = clientIP ? clientIP.replace(/::ffff:/g, "") : clientIP;

    if (isLocalhost(clientIP) || (allowedIPList && allowedIPList.includes(clientIP))) {
        next();
    } else {
        return req.destroy();
    }
};

const restrictHttpHostHeaderInjection = (req, res, next) => {
    logger.info(
        `# Request from  ##  ${req.headers["x-forwarded-for"] || req.socket.remoteAddress} # WAF NAT IP ## ${req.ip}  # at ${new Date().toJSON()} # to  ${req.originalUrl}`
    );

    // if (req.hostname !== hostName && req.hostname !== "localhost") {
    //     logger.warn("Invalid Host :: " + req.hostname + " on " + hostName);
    //     res.status(400).send("Request Not Allowed as Host is invalid");
    // } else {
        next();
    // }
};

const restrictHttpOptionRequest = (req, res, next) => {
    if (req.method === "OPTIONS") {
        if (req.headers["access-control-request-method"] === "POST" || req.headers["access-control-request-method"] === "GET") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST, GET");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.setHeader("X-XSS-Protection", "1; mode=block");
            res.status(200).end();
        } else {
            res.status(405).send("Method Not Allowed");
        }
    } else {
        next();
    }
};

const setMandatoryHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, authToken, Authorization, CSRF-Token, Division");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    next();
};

// Prevent Cross-Origin Resource Sharing (CORS) / HTTP OPTIONS Method
// ******* Please make origin * to enable access to another origin
// (not recommended for security purpose) *****
const corsMiddleware = () => {
    return cors({
        origin: function (origin, callback) {
            logger.info(`origin ${origin}`);
            callback(null, origin);
        },
        methods: "GET, POST",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });
};

// helmet configuration / Prevent XSS-Filter, X-Frame-Options, Insecure CSP, hide PoweredBy, X-Permitted-Cross-Domain-Policies

const preventXSSFilter = () => helmet({xssFilter: false});
const preventXFrameOptions = () => helmet.frameguard({action: "deny"});
const hidePoweredBy = () => helmet.hidePoweredBy();
const setCrossDomainPolicies = () => helmet.permittedCrossDomainPolicies({permittedPolicies: "none"});
const setHsts = () => helmet.hsts({maxAge: 63072000, includeSubDomains: true, preload: true});
const setCsp = () => {
    return helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://code.jquery.com",
                "https://stackpath.bootstrapcdn.com",
                "https://cdn.jsdelivr.net/npm/@angular/",
                "https://cdn.jsdelivr.net/npm/bootstrap",
                "https://cdn.jsdelivr.net/npm/@angular-devkit/",
                "https://cdn.jsdelivr.net/npm/typescript",
            ],
            styleSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://cdn.jsdelivr.net/npm/@angular/",
                "https://cdn.jsdelivr.net/npm/bootstrap",
            ],
        },
    });
};

const serverConfigMiddleware = {
    denyAllExceptWAFRequest,
    restrictHttpHostHeaderInjection,
    restrictHttpOptionRequest,
    setMandatoryHeaders,
    corsMiddleware,
    preventXSSFilter,
    preventXFrameOptions,
    hidePoweredBy,
    setCrossDomainPolicies,
    setHsts,
    setCsp,
};

export {serverConfigMiddleware};
