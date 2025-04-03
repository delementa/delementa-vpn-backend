import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ICommandResponse } from '@common/types';

import { ILogin } from '@modules/auth/interfaces';
import { createHmac } from 'node:crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly jwtSecret: string;
    private readonly saltRounds: number;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtSecret = this.configService.getOrThrow<string>('JWT_AUTH_SECRET');
        this.saltRounds = 10;
    }

    public async login(dto: ILogin): Promise<ICommandResponse<{ accessToken: string }>> {
        try {
            const {username, password} = dto
            


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
}
