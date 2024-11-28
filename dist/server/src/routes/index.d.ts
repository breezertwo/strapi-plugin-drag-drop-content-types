declare const _default: {
    dragdrop: {
        type: string;
        routes: {
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
                auth: boolean;
            };
        }[];
    };
    settings: {
        type: string;
        routes: {
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
            };
        }[];
    };
};
export default _default;
