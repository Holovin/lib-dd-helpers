import * as winston from 'winston';
import { format, Logger as WinLogger, verbose } from 'winston';
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
    private log: WinLogger;
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

        let logErrorFilename = '';
        let logInfoFilename = '';
        let logAllFilename = '';
        let logConsoleLevel = 'verbose';
        let logBaseLevel = 'silly';
        let logDirectory = '';

        logErrorFilename = this.config.get('dd:log:error');
        logInfoFilename = this.config.get('dd:log:info');
        logAllFilename = this.config.get('dd:log:all');
        logDirectory = this.config.get('dd:log:dir');

        if (this.config.get('dd:log:default')) {
            logConsoleLevel = 'verbose';
            logErrorFilename = 'log_error.log';
            logInfoFilename = 'log_info.log';
            logAllFilename = 'log_all.log';
        }

        jetpack.dir(logDirectory);

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

    public getLogger(moduleName: string): WinLogger {
        return this.log.child( { service: moduleName });
    }
}

export { Logger };
