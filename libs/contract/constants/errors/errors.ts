export const ERRORS = {
    INTERNAL_SERVER_ERROR: { code: 'A001', message: 'Server error', httpCode: 500 },
    LOGIN_ERROR: { code: 'A002', message: 'Login error', httpCode: 500 },
    UNAUTHORIZED: { code: 'A003', message: 'Unauthorized', httpCode: 401 },
    FORBIDDEN: { code: 'A004', message: 'Access blocked', httpCode: 403 },
    CREATE_ADMIN_ERROR: { code: 'A005', message: 'Create admin error', httpCode: 500 },
    ADMIN_NOT_FOUND: { code: 'A006', message: 'Admin not found', httpCode: 404 },
} as const;
