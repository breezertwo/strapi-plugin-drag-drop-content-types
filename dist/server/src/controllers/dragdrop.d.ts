import type { Core } from '@strapi/strapi';
declare const controller: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    welcome(ctx: any): Promise<void>;
    sortIndex(ctx: any): Promise<void>;
    batchUpdate(ctx: any): Promise<void>;
};
export default controller;
