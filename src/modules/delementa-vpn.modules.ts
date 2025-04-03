import { Module } from '@nestjs/common';

import { AdminModule } from '@modules/admin/admin.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
    imports: [AdminModule, AuthModule],
})
export class DelementaVpnModules {}
