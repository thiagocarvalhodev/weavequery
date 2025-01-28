import chalk from 'chalk';

export class Logger {
    static success(message: string): void {
        console.log(chalk.green('✓'), message);
    }

    static error(message: string): void {
        console.error(chalk.red('✗'), message);
    }

    static info(message: string): void {
        console.log(chalk.blue('ℹ'), message);
    }

    static warn(message: string): void {
        console.log(chalk.yellow('⚠'), message);
    }
} 