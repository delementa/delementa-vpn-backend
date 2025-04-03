import { createHmac } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { ERRORS, ROLE } from '@contract/constants';

import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ICommandResponse } from '@common/types';

import { GetAdminByUsernameQuery } from '@modules/admin/queries/get-admin-by-username';
import { CreateAdminCommand } from '@modules/admin/commands/create-admin';
import { AdminEntity } from '@modules/admin/entities/admin.entity';
import { ILogin, IRegister } from '@modules/auth/interfaces';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly jwtSecret: string;
    private readonly saltRounds: number;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {
        this.jwtSecret = this.configService.getOrThrow<string>('JWT_AUTH_SECRET');
        this.saltRounds = 10;
    }

    public async login(dto: ILogin): Promise<ICommandResponse<{ accessToken: string }>> {
        try {
            const { username, password } = dto;

            const admin = await this.getAdminByUsername({
                username,
                role: ROLE.ADMIN,
            });

            if (!admin.success || !admin.response) {
                return {
                    success: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const isPasswordValid = await this.verifyPassword(
                password,
                admin.response.passwordHash,
            );

            if (!isPasswordValid) {
                return {
                    success: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const accessToken = this.jwtService.sign(
                {
                    username,
                    uuid: admin.response.id,
                    role: ROLE.ADMIN,
                },
                { expiresIn: '12h' },
            );

            return {
                success: true,
                response: { accessToken },
            };
        } catch (error) {
            this.logger.error(error);

            return {
                success: false,
                ...ERRORS.LOGIN_ERROR,
            };
        }
    }

    public async register(dto: IRegister): Promise<ICommandResponse<{ accessToken: string }>> {
        try {
            const { username, password } = dto;

            const admin = await this.getAdminByUsername({
                username,
                role: ROLE.ADMIN,
            });

            if (admin.success && admin.response) {
                return {
                    success: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const hashedPassword = await this.hashPassword(password);

            const createAdminResponse = await this.createAdmin({
                username,
                password: hashedPassword,
                role: ROLE.ADMIN,
            });

            if (!createAdminResponse.success || !createAdminResponse.response) {
                return {
                    success: false,
                    ...ERRORS.CREATE_ADMIN_ERROR,
                };
            }

            const accessToken = this.jwtService.sign(
                {
                    username,
                    uuid: createAdminResponse.response.id,
                    role: ROLE.ADMIN,
                },
                { expiresIn: '12h' },
            );

            return {
                success: true,
                response: { accessToken },
            };
        } catch (error) {
            this.logger.error(error);
            return {
                success: false,
                ...ERRORS.LOGIN_ERROR,
            };
        }
    }

    private applySecretHmac(password: string, secret: string): Buffer {
        const hmac = createHmac('sha256', secret);
        hmac.update(password);
        return hmac.digest();
    }

    private async verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
        const hmacResult = this.applySecretHmac(plainPassword, this.jwtSecret);

        return bcrypt.compare(hmacResult.toString('hex'), storedHash);
    }

    private async getAdminByUsername(
        dto: GetAdminByUsernameQuery,
    ): Promise<ICommandResponse<AdminEntity>> {
        return this.queryBus.execute<GetAdminByUsernameQuery, ICommandResponse<AdminEntity>>(
            new GetAdminByUsernameQuery(dto.username, dto.role),
        );
    }

    private async createAdmin(dto: CreateAdminCommand): Promise<ICommandResponse<AdminEntity>> {
        return this.commandBus.execute<CreateAdminCommand, ICommandResponse<AdminEntity>>(
            new CreateAdminCommand(dto.username, dto.password, dto.role),
        );
    }

    private async hashPassword(password: string): Promise<string> {
        const hmacResult = this.applySecretHmac(password, this.jwtSecret);
        return bcrypt.hash(hmacResult.toString('hex'), this.saltRounds);
    }
}
