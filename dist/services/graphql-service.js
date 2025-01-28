import fetch from 'node-fetch';
import { Logger } from '../utils/logger.js';
export class GraphQLService {
    constructor() {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    async executeQuery(endpoint, query, options = {}) {
        const timeout = options.timeout || 30000; // Default 30s timeout
        try {
            Logger.info(`Executing GraphQL query to ${endpoint}...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                body: JSON.stringify({
                    query,
                    variables: options.variables,
                }),
                signal: controller.signal, // Type assertion to fix compatibility
            };
            const response = await fetch(endpoint, fetchOptions);
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.errors?.length) {
                const errorMessages = result.errors.map(e => e.message).join(', ');
                throw new Error(`GraphQL errors: ${errorMessages}`);
            }
            Logger.success('Query executed successfully');
            return result;
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                Logger.error(`Query timed out after ${timeout}ms`);
                throw new Error('Query execution timed out');
            }
            Logger.error(`Failed to execute query: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
}
//# sourceMappingURL=graphql-service.js.map