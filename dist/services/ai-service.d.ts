export declare class AIService {
    private readonly baseUrl;
    private readonly model;
    constructor(baseUrl?: string, model?: string);
    generateGraphQLQuery(description: string): Promise<string>;
    private buildPrompt;
    private cleanGeneratedQuery;
    private formatQuery;
}
