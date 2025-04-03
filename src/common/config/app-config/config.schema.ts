import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const configSchema = z.object({
    DATABASE_URL: z.string(),
    APP_PORT: z
        .string()
        .default('3000')
        .transform((port) => parseInt(port, 10)),
    METRICS_PORT: z
        .string()
        .default('3001')
        .transform((port) => parseInt(port, 10)),
    JWT_AUTH_SECRET: z
        .string()
        .refine((val) => val !== 'change_me', 'JWT_AUTH_SECRET cannot be set to "change_me"'),
    JWT_API_TOKENS_SECRET: z
        .string()
        .refine((val) => val !== 'change_me', 'JWT_API_TOKENS_SECRET cannot be set to "change_me"'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
export class Env extends createZodDto(configSchema) {}
