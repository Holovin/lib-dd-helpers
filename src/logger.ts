import * as winston from 'winston';
import { format, Logger as LoggerType, verbose } from 'winston';
import { Singleton } from './helpers/singleton';
import { Config } from './config';
import jetpack from 'fs-jetpack';

/*
  error:   0 — messages
  warn:    1 — messages
  info:    2 — messages
  http:    3 - ×
  verbose: 4 — messages
  debug:   5 — processed data
  silly:   6 — http requests
 */

class Logger extends Singleton {
    protected static instance: Logger;
    private log: LoggerType;
    private config: Config;

    protected constructor() {
        super();

        this.config = Config.getInstance();

        const loggerFormatter = format.printf(info =>
            `[${info.timestamp}] (${info.service ?? '?'}) ${info.level.toUpperCase()}: ${info.message}`
        );

        const formatter = format.combine(
            format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), loggerFormatter,
        );

        const transports = [];

        let logAllFilename = '';
        let logBaseLevel = '';
        let logConsoleLevel = '';
        let logDirectory = '';
        let logErrorFilename = '';
        let logInfoFilename = '';

        if (this.config.get('dd:log:default')) {
            logAllFilename = 'log_all.log';
            logBaseLevel = 'silly';
            logConsoleLevel = 'verbose';
            logErrorFilename = 'log_error.log';
            logInfoFilename = 'log_info.log';
        }

        logAllFilename = logAllFilename ?? this.config.get('dd:log:all');
        logBaseLevel = logBaseLevel ?? this.config.get('dd:log:base');
        logConsoleLevel = logConsoleLevel ?? this.config.get('dd:log:console');
        logErrorFilename = logErrorFilename ?? this.config.get('dd:log:error');
        logInfoFilename = logInfoFilename ?? this.config.get('dd:log:info');
        logDirectory = this.config.get('dd:log:dir');

        if (logDirectory) {
            jetpack.dir(logDirectory);
        }

        if (logErrorFilename) {
            transports.push(
                new winston.transports.File({
                    filename: `${logDirectory}${logErrorFilename}`,
                    level: 'error',
                    format: formatter,
                }),
            );
        }

        if (logInfoFilename) {
            transports.push(
                new winston.transports.File({
                    filename: `${logDirectory}${logInfoFilename}`,
                    level: 'info',
                    format: formatter,
                }),
            );
        }

        if (logAllFilename) {
            transports.push(
                new winston.transports.File({
                    filename: `${logDirectory}${logAllFilename}`,
                    format: formatter,
                }),
            )
        }

        this.log = winston.createLogger({
            level: logBaseLevel,
            format: winston.format.json(),
            transports: transports,
        });

        this.log.add(new winston.transports.Console({
            format: formatter,
            level: logConsoleLevel,
        }));
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public getLogger(moduleName: string): LoggerType {
        return this.log.child( { service: moduleName });
    }
}

export { Logger, LoggerType };
