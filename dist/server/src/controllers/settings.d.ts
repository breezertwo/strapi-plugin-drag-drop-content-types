import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getSettings(ctx: any): Promise<void>;
    setSettings(ctx: any): Promise<void>;
};
export default _default;
