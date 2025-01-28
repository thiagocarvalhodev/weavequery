import fetch from 'node-fetch';
import { Logger } from '../utils/logger.js';
import { ARWEAVE_SCHEMA_CONTEXT } from './schema-context.js';

interface OllamaResponse {
    response: string;
    context: number[];
}

export class AIService {
    private readonly baseUrl: string;
    private readonly model: string;

    constructor(baseUrl: string = 'http://localhost:11434', model: string = 'codellama') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async generateGraphQLQuery(description: string): Promise<string> {
        try {
            Logger.info('Generating Arweave GraphQL query...');

            const prompt = this.buildPrompt(description, ARWEAVE_SCHEMA_CONTEXT);

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as OllamaResponse;
            const query = this.cleanGeneratedQuery(data.response);

            Logger.success('Query generated successfully');
            return query;
        } catch (error) {
            Logger.error(`Failed to generate query: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    private buildPrompt(description: string, schemaContext: string): string {
        return `
You are a GraphQL query generator specialized in Arweave blockchain queries.

Schema Context:
${schemaContext}

Task: Generate a GraphQL query based on this description: ${description}

Requirements:
1. Use only the types and fields defined in the schema above
2. Follow Arweave best practices and common patterns
3. Include appropriate arguments and filters
4. Return only the GraphQL query without any explanation or markdown
5. Ensure the query is valid GraphQL syntax
6. For tag filters:
   - Always use the format: tags: [{ name: "Tag-Name", values: ["value"] }]
   - Include only requested tags
   - Omit the tags argument if no tags are specified
7. Only include non-empty/non-null arguments
8. Always include id and tags fields in the response
9. Only add other fields if specifically requested

Generate the query:
`;
    }

    private cleanGeneratedQuery(query: string): string {
        // Remove any markdown code blocks if present
        query = query.replace(/```graphql?\s*|\s*```/g, '');
        // Remove any leading/trailing whitespace
        query = query.trim();
        // Ensure consistent formatting
        return this.formatQuery(query);
    }

    private formatQuery(query: string): string {
        // Basic query formatting
        return query
            .replace(/\s+/g, ' ')
            .replace(/{\s*/g, '{\n  ')
            .replace(/}\s*/g, '\n}\n')
            .replace(/\s*:\s*/g, ': ')
            .replace(/,\s*/g, ',\n  ')
            .trim();
    }
} 