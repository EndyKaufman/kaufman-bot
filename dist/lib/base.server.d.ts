export interface IServer {
    app: any;
}
export declare class BaseServer implements IServer {
    protected name: string;
    app: any;
    protected port: string;
    constructor(name?: string);
    protected readonly namePrefix: string;
}
