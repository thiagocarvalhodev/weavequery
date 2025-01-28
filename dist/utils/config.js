import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
const ConfigSchema = z.object({
    defaultName: z.string().optional(),
    ai: z.object({
        baseUrl: z.string().default('http://localhost:11434'),
        model: z.string().default('codellama')
    }).optional()
});
export class ConfigManager {
    constructor() {
        this.config = {};
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    async loadConfig() {
        const explorer = cosmiconfig('mycli');
        const result = await explorer.search();
        if (result && !result.isEmpty) {
            this.config = ConfigSchema.parse(result.config);
        }
    }
    getConfig() {
        return this.config;
    }
}
//# sourceMappingURL=config.js.map