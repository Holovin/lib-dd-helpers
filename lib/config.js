"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const nconf_1 = __importDefault(require("nconf"));
const singleton_1 = require("./helpers/singleton");
class Config extends singleton_1.Singleton {
    constructor(fileName) {
        super();
        this.config = nconf_1.default.env().file({ file: fileName });
    }
    static getInstance() {
        if (!Config.instance) {
            let fileName = 'config.json';
            if (process.env.DD_CONFIG_FILE) {
                fileName = process.env.DD_CONFIG_FILE;
            }
            Config.instance = new Config(fileName);
        }
        return Config.instance;
    }
    get(key) {
        return this.config.get(key);
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map