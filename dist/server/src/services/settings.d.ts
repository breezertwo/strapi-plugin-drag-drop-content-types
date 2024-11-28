import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getSettings(): Promise<unknown>;
    setSettings(settings: any): Promise<unknown>;
};
export default _default;
