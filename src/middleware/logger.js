const util = require("util");
const winston = require("winston");

// ** Format shall be: { hello: 'hello' }
const LOGGING_LEVELS = Object.keys(winston.config.syslog.levels).reduce(
  (acc, logLevel) => ({
    ...acc,
    [logLevel]: logLevel,
  }),
  {}
);

const WinFormat = winston.format;
const WinTransports = winston.transports;

/**
 * This filter helps ensure that we maintain log files for log levels we want. Ex.: errors only go in error-*.log and not also in debug-*.log
 * @param {Array<string>} reqLevel
 * @returns
 */
const WinFormatFilter = (reqLevel) =>
  WinFormat((info) => (reqLevel.includes(info.level) ? info : false));

/**
 * Defines the format for the log
 * @param {Array<string>} reqLevel
 * @returns
 */
const logFormat = (reqLevel = []) => {
  return WinFormat.combine(
    WinFormatFilter(reqLevel)(),
    WinFormat.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    WinFormat.prettyPrint(),
    WinFormat.align(),
    WinFormat.printf((info) => {
      const infoLevel =
        info.level === LOGGING_LEVELS.warning
          ? LOGGING_LEVELS.warning.slice(0, 4)
          : info.level;
      return `[${info.timestamp}] [${infoLevel}]: ${info.message}`;
    })
  );
};

const logger = winston.createLogger({
  level: "debug",
  levels: winston.config.syslog.levels,
  transports: [
    // ** console
    new WinTransports.Console({
      format: logFormat(Object.values(LOGGING_LEVELS)),
      level: LOGGING_LEVELS.debug,
    }),
  ],
});

logger.info("Winston logger initialized");

process.on("uncaughtException", (error) => {
  const _ = util.inspect(error, { showHidden: false }); // ** errorDetails: Not needed at the moment
  logger.error(
    "Uncaught exception: " + (error?.stack || error?.message || error)
  );
});

// ** _promise is not being used
process.on("unhandledRejection", (reason, _promise) => {
  const _ = util.inspect(reason, { showHidden: false }); // ** errorDetails: Not needed at the moment
  logger.error(
    "Unhandled rejection: " + (reason?.stack || reason?.message || reason)
  );
});

module.exports = logger;
