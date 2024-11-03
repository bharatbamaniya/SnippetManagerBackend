import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";
import compression from "compression";
import {serverConfigMiddleware} from "./src/middlewares/serverConfigMiddleware.js";
import {loggerMiddleware} from "./src/utils/logger.js";
// import routes
import routes from "./src/routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const index = express();

// ## ----------- APP CONFIGURATION BEGINS HERE ----------- ## //
index.use(serverConfigMiddleware.restrictHttpHostHeaderInjection);
index.use(serverConfigMiddleware.corsMiddleware());
index.use(serverConfigMiddleware.setMandatoryHeaders);
index.use(serverConfigMiddleware.restrictHttpOptionRequest);
index.use(serverConfigMiddleware.denyAllExceptWAFRequest);

index.use(express.static(path.resolve(__dirname, "..", "/public")));
index.use(compression());
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({extended: true}));
index.use(bodyParser.json({limit: "50mb", extended: true}));

index.use(serverConfigMiddleware.preventXSSFilter()); // Prevent XSS-Filter
index.use(serverConfigMiddleware.preventXFrameOptions()); // Prevent X-Frame-Options
index.use(serverConfigMiddleware.setCsp()); // Prevent Insecure Content Security Policy (CSP)
index.use(serverConfigMiddleware.hidePoweredBy());
index.use(serverConfigMiddleware.setCrossDomainPolicies()); // Prevent Unset/Insecure X-Permitted-Cross-Domain-Policies Header
index.use(serverConfigMiddleware.setHsts());

index.use(loggerMiddleware);
// ## ----------- APP CONFIGURATION ENDS HERE ----------- ## //

// routes
index.use(routes);

const PORT = process.env.PORT || 8080;
// import { index } from "./index.js";


index.listen(PORT, function () {
    console.log("Server is listening on port ", PORT);
});

export {index};
