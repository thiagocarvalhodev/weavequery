import { Command } from '../types/command.js';
export declare class GenerateQueryCommand implements Command {
    private aiService;
    private graphqlService;
    constructor();
    execute(): Promise<void>;
}
