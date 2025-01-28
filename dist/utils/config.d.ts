import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    defaultName: z.ZodOptional<z.ZodString>;
    ai: z.ZodOptional<z.ZodObject<{
        baseUrl: z.ZodDefault<z.ZodString>;
        model: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        baseUrl: string;
        model: string;
    }, {
        baseUrl?: string | undefined;
        model?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    defaultName?: string | undefined;
    ai?: {
        baseUrl: string;
        model: string;
    } | undefined;
}, {
    defaultName?: string | undefined;
    ai?: {
        baseUrl?: string | undefined;
        model?: string | undefined;
    } | undefined;
}>;
type Config = z.infer<typeof ConfigSchema>;
export declare class ConfigManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): ConfigManager;
    loadConfig(): Promise<void>;
    getConfig(): Config;
}
export {};
