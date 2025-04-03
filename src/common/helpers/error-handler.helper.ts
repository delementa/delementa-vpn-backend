import { InternalServerErrorException } from '@nestjs/common';

import { HttpExceptionWithErrorCodeType } from '@common/exception';
import { ICommandResponse } from '@common/types';
import { ERRORS } from '@libs/contracts/constants/errors';

export function errorHandler<T>(response: ICommandResponse<T>): T {
    if (response.success) {
        if (!response.response) {
            throw new InternalServerErrorException('No data returned');
        }
        return response.response;
    } else {
        if (!response.code) {
            throw new InternalServerErrorException('Unknown error');
        }
        const errorObject = Object.values(ERRORS).find((error) => error.code === response.code);

        if (!errorObject) {
            throw new InternalServerErrorException('Unknown error');
        }
        throw new HttpExceptionWithErrorCodeType(
            response.message || errorObject.message,
            errorObject.code,
            errorObject.httpCode,
        );
    }
}
