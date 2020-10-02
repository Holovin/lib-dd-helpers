"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.Config = void 0;
const config_1 = require("./config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_1.Config; } });
const logger_1 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
/// tests
const config = config_1.Config.getInstance().get('1');
const log = logger_1.Logger.getInstance().getLogger('test').info('test');
//# sourceMappingURL=index.js.map