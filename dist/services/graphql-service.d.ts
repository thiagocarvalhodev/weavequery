interface GraphQLResponse {
    data?: any;
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
        path?: string[];
    }>;
}
interface GraphQLRequestOptions {
    variables?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeout?: number;
}
export declare class GraphQLService {
    private readonly defaultHeaders;
    constructor();
    executeQuery(endpoint: string, query: string, options?: GraphQLRequestOptions): Promise<GraphQLResponse>;
}
export {};
