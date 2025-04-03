import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { getJWTConfig } from '@common/config/jwt';

import { AuthController } from '@modules/auth/auth.controller';
import { JwtStrategy } from '@modules/auth/strategies';

@Module({
    imports: [CqrsModule, JwtModule.registerAsync(getJWTConfig())],
    controllers: [AuthController],
    providers: [JwtStrategy],
})
export class AuthModule {}
