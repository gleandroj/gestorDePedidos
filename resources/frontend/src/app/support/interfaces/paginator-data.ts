export interface PaginatorData<T> {
    data: Array<T>;
    meta?: {
        current_page?: number;
        from?: number;
        last_page?: number;
        per_page?: number;
        to?: number;
        total?: number;
        path?: string;
    };
    links?: {
        first?: string;
        last?: string;
        next?: string;
        prev?: string;
    };
}
