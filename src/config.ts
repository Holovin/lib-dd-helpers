import nconf, { Provider } from 'nconf';
import { Singleton } from './helpers/singleton';
import jetpack from 'fs-jetpack';

class Config extends Singleton {
    protected static instance: Config;
    private config: Provider;

    protected constructor(fileName: string) {
        super();

        try {
            this.config = nconf.env().file({ file: fileName });
        } catch (e) {
            console.error(`[DD / Config] Init error: ${e.message}`);
            throw e;
        }
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            let fileName = 'config.json';

            if (process.env.DD_CONFIG_FILE) {
                fileName = process.env.DD_CONFIG_FILE;
            }

            if (jetpack.exists(fileName) !== 'file') {
                console.warn('[DD / Config] Cant load config file');
            }

            Config.instance = new Config(fileName);
        }

        return Config.instance;
    }

    public get(key: string, defaultValue: string = null): any {
        return this.config.get(key) || defaultValue;
    }
}

export { Config };
