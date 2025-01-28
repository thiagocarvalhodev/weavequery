import inquirer from 'inquirer';
import { Command } from '../types/command.js';
import { AIService } from '../services/ai-service.js';
import { GraphQLService } from '../services/graphql-service.js';
import { Logger } from '../utils/logger.js';
import chalk from 'chalk';

export class GenerateQueryCommand implements Command {
    private aiService: AIService;
    private graphqlService: GraphQLService;

    constructor() {
        this.aiService = new AIService();
        this.graphqlService = new GraphQLService();
    }

    async execute(): Promise<void> {
        try {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'description',
                    message: 'Describe the Arweave GraphQL query you want to generate:',
                    validate: (input: string) => {
                        if (input.trim().length < 10) {
                            return 'Please provide a more detailed description (at least 10 characters)';
                        }
                        return true;
                    }
                }
            ]);

            const query = await this.aiService.generateGraphQLQuery(answers.description);
            
            console.log('\nGenerated GraphQL Query:');
            console.log(chalk.cyan(query));

            const executeAnswer = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'execute',
                    message: 'Would you like to execute this query?',
                    default: true
                }
            ]);

            if (executeAnswer.execute) {
                const endpoint = 'https://arweave.net/graphql';
                const result = await this.graphqlService.executeQuery(endpoint, query);
                
                console.log('\nQuery Result:');
                console.log(chalk.green(JSON.stringify(result.data, null, 2)));
            } else {
                console.log('\nExample usage with curl:');
                console.log(chalk.yellow(`curl https://arweave.net/graphql \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"query": ${JSON.stringify(query)}}'`));
            }
            
            Logger.success('Query generation completed');
        } catch (error) {
            Logger.error(`Failed to execute command: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
} 