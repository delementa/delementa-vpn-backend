import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@common/exception';
import { errorHandler } from '@common/helpers';
import { AUTH_CONTROLLER, AUTH_ROUTES } from '@libs/contracts/api';

import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from './dtos';
import { AuthResponseModel, RegisterResponseModel } from './model';
import { AuthService } from './auth.service';

@ApiTags('Auth Controller')
@UseFilters(HttpExceptionFilter)
@Controller(AUTH_CONTROLLER)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post(AUTH_ROUTES.LOGIN)
    async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
        const result = await this.authService.login(body);

        const data = errorHandler(result);

        return {
            response: new AuthResponseModel(data),
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post(AUTH_ROUTES.REGISTER)
    async register(@Body() body: RegisterRequestDto): Promise<RegisterResponseDto> {
        const result = await this.authService.register(body);

        const data = errorHandler(result);

        return {
            response: new RegisterResponseModel(data),
        };
    }
}
