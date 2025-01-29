import fetch, { RequestInit, AbortSignal } from 'node-fetch';
import { Logger } from '../utils/logger.js';

interface GraphQLData {
    [key: string]: unknown;
}

interface GraphQLResponse {
    data?: GraphQLData;
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

export class GraphQLService {
    private readonly defaultHeaders: Record<string, string>;

    constructor() {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    async executeQuery(
        endpoint: string,
        query: string,
        options: GraphQLRequestOptions = {}
    ): Promise<GraphQLResponse> {
        const timeout = options.timeout || 30000; // Default 30s timeout

        try {
            Logger.info(`Executing GraphQL query to ${endpoint}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const fetchOptions: RequestInit = {
                method: 'POST',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                body: JSON.stringify({
                    query,
                    variables: options.variables,
                }),
                signal: controller.signal as AbortSignal,
            };

            const response = await fetch(endpoint, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json() as GraphQLResponse;

            if (result.errors?.length) {
                const errorMessages = result.errors.map(e => e.message).join(', ');
                throw new Error(`GraphQL errors: ${errorMessages}`);
            }

            Logger.success('Query executed successfully');
            return result;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                Logger.error(`Query timed out after ${timeout}ms`);
                throw new Error('Query execution timed out');
            }

            Logger.error(`Failed to execute query: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
} 