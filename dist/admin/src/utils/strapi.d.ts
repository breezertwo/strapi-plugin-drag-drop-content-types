import { GetPageEntriesResponse, Pagination } from "../components/SortModal/types";
export declare const GET_DATA = "ContentManager/ListView/GET_DATA";
export declare const GET_DATA_SUCCEEDED = "ContentManager/ListView/GET_DATA_SUCCEEDED";
export declare function getData(uid: any, params: any): {
    type: string;
    uid: any;
    params: any;
};
export declare function getDataSucceeded(pagination: Pagination, data: GetPageEntriesResponse[]): {
    type: string;
    pagination: Pagination;
    data: GetPageEntriesResponse[];
};
