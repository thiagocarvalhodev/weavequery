import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

const ConfigSchema = z.object({
    defaultName: z.string().optional(),
    ai: z.object({
        baseUrl: z.string().default('http://localhost:11434'),
        model: z.string().default('codellama')
    }).optional()
});

type Config = z.infer<typeof ConfigSchema>;

export class ConfigManager {
    private static instance: ConfigManager;
    private config: Config = {};

    private constructor() {}

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    async loadConfig(): Promise<void> {
        const explorer = cosmiconfig('mycli');
        const result = await explorer.search();

        if (result && !result.isEmpty) {
            this.config = ConfigSchema.parse(result.config);
        }
    }

    getConfig(): Config {
        return this.config;
    }
} 