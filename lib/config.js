"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const nconf_1 = __importDefault(require("nconf"));
const singleton_1 = require("./helpers/singleton");
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
class Config extends singleton_1.Singleton {
    constructor(fileName) {
        super();
        try {
            this.config = nconf_1.default.env().file({ file: fileName });
        }
        catch (e) {
            console.error(`[DD / Config] Init error: ${e.message}`);
            throw e;
        }
    }
    static getInstance() {
        if (!Config.instance) {
            let fileName = 'config.json';
            if (process.env.DD_CONFIG_FILE) {
                fileName = process.env.DD_CONFIG_FILE;
            }
            if (fs_jetpack_1.default.exists(fileName) !== 'file') {
                console.warn('[DD / Config] Cant load config file');
            }
            Config.instance = new Config(fileName);
        }
        return Config.instance;
    }
    get(key, defaultValue = null) {
        return this.config.get(key) || defaultValue;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map