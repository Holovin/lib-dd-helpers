import { Singleton } from './helpers/singleton';
declare class Config extends Singleton {
    protected static instance: Config;
    private config;
    protected constructor(fileName: string);
    static getInstance(): Config;
    get(key: string, defaultValue?: string): any;
}
export { Config };
