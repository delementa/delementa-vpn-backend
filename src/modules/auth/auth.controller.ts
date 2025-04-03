import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@common/exception';
import { AUTH_CONTROLLER } from '@libs/contracts/api';

@ApiTags('Auth Controller')
@UseFilters(HttpExceptionFilter)
@Controller(AUTH_CONTROLLER)
export class AuthController {}
