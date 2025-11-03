import winston, { transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      dirname: `logs/combined`,
      filename: "combined",
      extension: ".log",
      level: "info",
    }),
    new DailyRotateFile({
      dirname: `logs/errors`,
      filename: "errors",
      extension: ".log",
      level: "error",
    }),
  ],
});