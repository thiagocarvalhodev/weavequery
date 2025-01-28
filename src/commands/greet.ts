import chalk from 'chalk';
import inquirer from 'inquirer';
import { Command } from '../types/command.js';
import { Logger } from '../utils/logger.js';

export class GreetCommand implements Command {
    async execute(): Promise<void> {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your name?',
                default: 'User'
            }
        ]);

        console.log(chalk.green(`Hello, ${answers.name}!`));
        Logger.success('Command completed successfully');
        Logger.info('Processing...');
    }
} 