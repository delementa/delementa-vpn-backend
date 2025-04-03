import * as CONTROLLERS from './controllers';

export const ROOT = '/api' as const;

export const REST_API = {
    AUTH: {
        LOGIN: `${ROOT}/${CONTROLLERS.AUTH_CONTROLLER}/${CONTROLLERS.AUTH_ROUTES.LOGIN}`,
        REGISTER: `${ROOT}/${CONTROLLERS.AUTH_CONTROLLER}/${CONTROLLERS.AUTH_ROUTES.REGISTER}`,
    },
} as const;
