"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = __importStar(require("winston"));
const winston_1 = require("winston");
const singleton_1 = require("./helpers/singleton");
const config_1 = require("./config");
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
/*
  error:   0 — messages
  warn:    1 — messages
  info:    2 — messages
  http:    3 - ×
  verbose: 4 — messages
  debug:   5 — processed data
  silly:   6 — http requests
 */
class Logger extends singleton_1.Singleton {
    constructor() {
        super();
        this.config = config_1.Config.getInstance();
        const loggerFormatter = winston_1.format.printf(info => { var _a; return `[${info.timestamp}] (${(_a = info.service) !== null && _a !== void 0 ? _a : '?'}) ${info.level.toUpperCase()}: ${info.message}`; });
        const formatter = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), loggerFormatter);
        const transports = [];
        let logErrorFilename = '';
        let logInfoFilename = '';
        let logAllFilename = '';
        let logConsoleLevel = '';
        let logBaseLevel = '';
        let logDirectory = '';
        logErrorFilename = this.config.get('dd:log:error');
        logInfoFilename = this.config.get('dd:log:info');
        logAllFilename = this.config.get('dd:log:all');
        logDirectory = this.config.get('dd:log:dir');
        logConsoleLevel = this.config.get('dd:log:console');
        logBaseLevel = this.config.get('dd:log:base');
        if (this.config.get('dd:log:default')) {
            logBaseLevel = 'silly';
            logConsoleLevel = 'verbose';
            logErrorFilename = 'log_error.log';
            logInfoFilename = 'log_info.log';
            logAllFilename = 'log_all.log';
        }
        if (logDirectory) {
            fs_jetpack_1.default.dir(logDirectory);
        }
        if (logErrorFilename) {
            transports.push(new winston.transports.File({
                filename: `${logDirectory}${logErrorFilename}`,
                level: 'error',
                format: formatter,
            }));
        }
        if (logInfoFilename) {
            transports.push(new winston.transports.File({
                filename: `${logDirectory}${logInfoFilename}`,
                level: 'info',
                format: formatter,
            }));
        }
        if (logAllFilename) {
            transports.push(new winston.transports.File({
                filename: `${logDirectory}${logAllFilename}`,
                format: formatter,
            }));
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
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    getLogger(moduleName) {
        return this.log.child({ service: moduleName });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map