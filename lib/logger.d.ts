import { Logger as LoggerType } from 'winston';
import { Singleton } from './helpers/singleton';
declare class Logger extends Singleton {
    protected static instance: Logger;
    private log;
    private config;
    protected constructor();
    static getInstance(): Logger;
    getLogger(moduleName: string): LoggerType;
}
export { Logger, LoggerType };
