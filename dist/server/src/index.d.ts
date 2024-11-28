declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
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
    routes: {
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
    services: {
        dragdrop: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getWelcomeMessage(): {
                body: string;
            };
            sortIndex(contentType: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`, start: number, limit: number, locale: string, rankFieldName: string): Promise<{}>;
            batchUpdate(config: import("../../typings").PluginSettingsResponse, updates: import("../../typings").RankUpdate[], contentType: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`): Promise<{
                id: any;
                rank: any;
            }[]>;
        };
        settings: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getSettings(): Promise<unknown>;
            setSettings(settings: any): Promise<unknown>;
        };
    };
    contentTypes: {};
    policies: {};
    middlewares: {};
};
export default _default;
