import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";
import compression from "compression";
import {serverConfigMiddleware} from "./middlewares/serverConfigMiddleware.js";
import {loggerMiddleware} from "./utils/logger.js";
import http from "http";
import cluster from "cluster";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ## ----------- APP CONFIGURATION BEGINS HERE ----------- ## //
app.use(serverConfigMiddleware.restrictHttpHostHeaderInjection);
app.use(serverConfigMiddleware.corsMiddleware());
app.use(serverConfigMiddleware.setMandatoryHeaders);
app.use(serverConfigMiddleware.restrictHttpOptionRequest);
app.use(serverConfigMiddleware.denyAllExceptWAFRequest);

app.use(express.static(path.resolve(__dirname, "..", "/public")));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "50mb", extended: true}));

app.use(serverConfigMiddleware.preventXSSFilter()); // Prevent XSS-Filter
app.use(serverConfigMiddleware.preventXFrameOptions()); // Prevent X-Frame-Options
app.use(serverConfigMiddleware.setCsp()); // Prevent Insecure Content Security Policy (CSP)
app.use(serverConfigMiddleware.hidePoweredBy());
app.use(serverConfigMiddleware.setCrossDomainPolicies()); // Prevent Unset/Insecure X-Permitted-Cross-Domain-Policies Header
app.use(serverConfigMiddleware.setHsts());

app.use(loggerMiddleware);
// ## ----------- APP CONFIGURATION ENDS HERE ----------- ## //

// import routes
import routes from "./routes.js";

// routes
app.use(routes);

const PORT = process.env.PORT || 8080;
// import { app } from "./app.js";

const server = http.createServer(app);

server.listen(PORT, function () {
    console.log("Worker id", cluster.worker.id, "Server is listening on port ", PORT);
});
