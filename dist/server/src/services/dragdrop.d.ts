import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
import { PluginSettingsResponse, RankUpdate } from '../../../typings';
declare const dragdrop: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getWelcomeMessage(): {
        body: string;
    };
    sortIndex(contentType: StrapiTypes.UID.CollectionType, start: number, limit: number, locale: string, rankFieldName: string): Promise<{}>;
    /**
     *
     * @param {RankUpdate[]} updates
     * @param {StrapiTypes.UID.CollectionType} contentType
     */
    batchUpdate(config: PluginSettingsResponse, updates: RankUpdate[], contentType: StrapiTypes.UID.CollectionType): Promise<{
        id: any;
        rank: any;
    }[]>;
};
export default dragdrop;
