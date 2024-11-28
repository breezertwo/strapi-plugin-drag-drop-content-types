type TradOptions = Record<string, string>;
declare const _default: {
    register(app: any): void;
    bootstrap(app: any): void;
    registerTrads(app: any): Promise<({
        data: TradOptions;
        locale: string;
    } | {
        data: {};
        locale: string;
    })[]>;
};
export default _default;
