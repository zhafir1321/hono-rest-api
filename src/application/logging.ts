import * as winston from "winston"

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        winston.format.align(),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()]
})