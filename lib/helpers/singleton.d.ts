declare abstract class Singleton {
    protected static instance: Singleton;
    protected constructor();
    static getInstance(): void;
}
export { Singleton };
