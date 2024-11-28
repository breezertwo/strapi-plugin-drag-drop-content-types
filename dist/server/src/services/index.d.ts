declare const _default: {
    dragdrop: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getWelcomeMessage(): {
            body: string;
        };
        sortIndex(contentType: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`, start: number, limit: number, locale: string, rankFieldName: string): Promise<{}>;
        batchUpdate(config: import("../../../typings").PluginSettingsResponse, updates: import("../../../typings").RankUpdate[], contentType: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`): Promise<{
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
export default _default;
