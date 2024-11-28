declare const _default: {
    dragdrop: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        welcome(ctx: any): Promise<void>;
        sortIndex(ctx: any): Promise<void>;
        batchUpdate(ctx: any): Promise<void>;
    };
    settings: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getSettings(ctx: any): Promise<void>;
        setSettings(ctx: any): Promise<void>;
    };
};
export default _default;
