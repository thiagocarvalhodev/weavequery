#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { GreetCommand } from './commands/greet.js';
import { GenerateQueryCommand } from './commands/generate-query.js';
const program = new Command();
// CLI metadata
program
    .name('mycli')
    .description('A TypeScript CLI application')
    .version('1.0.0');
// Register commands
program
    .command('greet')
    .description('Greet the user')
    .action(async () => {
    try {
        const command = new GreetCommand();
        await command.execute();
    }
    catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('generate-query')
    .description('Generate a GraphQL query using AI')
    .action(async () => {
    try {
        const command = new GenerateQueryCommand();
        await command.execute();
    }
    catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Error handling for unknown commands
program.on('command:*', () => {
    console.error(chalk.red('Error: Invalid command'));
    console.log('Run', chalk.green('mycli --help'), 'for a list of available commands.');
    process.exit(1);
});
// Parse command line arguments
program.parse(process.argv);
// Show help if no arguments provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map