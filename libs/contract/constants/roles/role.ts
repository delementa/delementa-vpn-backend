export const ROLE = {
    ADMIN: 'ADMIN',
    // Возможно добавим другие роли
} as const;

export type TRole = typeof ROLE;
export type TRolesKeys = (typeof ROLE)[keyof typeof ROLE];
export type TRoleTypes = [keyof typeof ROLE][number];
