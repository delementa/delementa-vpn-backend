import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { createLogger } from 'winston';
import compression from 'compression';
import * as winston from 'winston';
import { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { ROOT } from '@contract/api';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { isDevelopment } from '@common/utils/startup-app';

import { AppModule } from './app.module';

const instanedId = process.env.INSTANCE_ID || '0';

const logger = createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(`API Server: #${instanedId}`, {
            colors: true,
            prettyPrint: true,
            processId: false,
            appName: true,
        }),
    ),
    level: isDevelopment() ? 'debug' : 'http',
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });

    app.use(json({ limit: '10mb' }));

    const config = app.get(ConfigService);

    app.use(compression());

    app.setGlobalPrefix(ROOT);

    app.enableCors({
        origin: isDevelopment() ? '*' : config.getOrThrow<string>('FRONT_END_DOMAIN'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: false,
    });

    app.useGlobalPipes(new ZodValidationPipe());

    await app.listen(Number(config.getOrThrow<string>('APP_PORT')));
}
void bootstrap();
