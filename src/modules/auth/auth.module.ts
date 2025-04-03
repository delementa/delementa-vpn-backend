import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { getJWTConfig } from '@common/config/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
    imports: [CqrsModule, JwtModule.registerAsync(getJWTConfig())],
    controllers: [AuthController],
    providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
