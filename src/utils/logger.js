import { createLogger, format, transports } from "winston";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

const timestampFormat = "YYYY-MM-DD hh:mm:ss.SSS A";

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
    format.timestamp({
        format: timestampFormat,
    }),
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
        return `${level}: ${message}`;
    })
);

const fileLogFormat = format.combine(
    format.timestamp({
        format: timestampFormat,
    }),
    format.align(),
    format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

// Create a Winston logger
const logger = createLogger({
    level: "info",
    format: fileLogFormat,
    transports: [
        new transports.Console({
            format: consoleLogFormat,
        }),
        // new transports.File({ filename: `./logs/snippet-manager-${process.env.NODE_ENV}.log` }),
    ],
});

const loggerMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger.info(JSON.stringify(logObject));
        },
    },
});

export { loggerMiddleware, logger };
