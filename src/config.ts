import nconf, { Provider } from 'nconf';
import { Singleton } from './helpers/singleton';

class Config extends Singleton {
    protected static instance: Config;
    private config: Provider;

    protected constructor(fileName: string) {
        super();

        this.config = nconf.env().file({ file: fileName });
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            let fileName = 'config.json';

            if (process.env.DD_CONFIG_FILE) {
                fileName = process.env.DD_CONFIG_FILE;
            }

            Config.instance = new Config(fileName);
        }

        return Config.instance;
    }

    public get(key: string): any {
        return this.config.get(key);
    }
}

export { Config };
