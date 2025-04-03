import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';

import { ICrud } from '@common/types';

import { AdminEntity } from '@modules/admin/entities/admin.entity';
import { AdminConverter } from '@modules/admin/admin.converter';

export class AdminRepository implements ICrud<AdminEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly adminConverter: AdminConverter,
    ) {}

    public async create(entity: AdminEntity): Promise<AdminEntity> {
        const model = this.adminConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.admin.create({
            data: model,
        });

        return this.adminConverter.fromPrismaModelToEntity(result);
    }

    public async findById(id: string): Promise<AdminEntity | null> {
        const result = await this.prisma.tx.admin.findUnique({
            where: { id },
        });
        if (!result) {
            return null;
        }
        return this.adminConverter.fromPrismaModelToEntity(result);
    }

    public async update({ id, ...data }: Partial<AdminEntity>): Promise<AdminEntity> {
        const result = await this.prisma.tx.admin.update({
            where: {
                id,
            },
            data,
        });

        return this.adminConverter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(dto: Partial<AdminEntity>): Promise<AdminEntity[]> {
        const adminList = await this.prisma.tx.admin.findMany({
            where: dto,
            orderBy: {
                createdAt: 'asc',
            },
        });
        return this.adminConverter.fromPrismaModelsToEntities(adminList);
    }

    public async findFirstByCriteria(dto: Partial<AdminEntity>): Promise<AdminEntity | null> {
        const result = await this.prisma.tx.admin.findFirst({
            where: dto,
        });

        if (!result) {
            return null;
        }

        return this.adminConverter.fromPrismaModelToEntity(result);
    }

    public async deleteById(id: string): Promise<boolean> {
        const result = await this.prisma.tx.admin.delete({ where: { id } });
        return !!result;
    }

    public async countByCriteria(dto: Partial<AdminEntity>): Promise<number> {
        const result = await this.prisma.tx.admin.count({ where: dto });
        return result;
    }
}
