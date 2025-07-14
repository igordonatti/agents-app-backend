import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { CreateTenantDto } from './dto/createTenant.dto';
import { UpdateTenantDto } from './dto/updateAgent.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTenant(data: CreateTenantDto) {
    const tenantExists = await this.prisma.tenants.findFirst({
      where: {
        name: data.name,
      },
    });

    if (tenantExists) throw new BadRequestException('Tenant já existe');

    const tenantCreated = await this.prisma.tenants.create({
      data: {
        name: data.name,
      },
    });

    // Criar pasta no onedrive com o nome do tenant

    return {
      message: 'Tenant criado com sucesso',
      tenant: tenantCreated,
    };
  }

  async deleteTenant(id: number) {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    const tenantDeleted = await this.prisma.tenants.delete({
      where: {
        id,
      },
    });

    // Deletar pasta no onedrive

    return {
      message: 'Tenant deletado com sucesso',
      tenant: tenantDeleted,
    };
  }

  async getTenants() {
    const tenants = await this.prisma.tenants.findMany();

    return tenants;
  }

  async getTenantById(id: number) {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    return tenant;
  }

  async updateTenant(id: number, data: UpdateTenantDto) {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    const tenantUpdated = await this.prisma.tenants.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });

    // Atualizar pasta no onedrive com o nome do tenant

    return {
      message: 'Tenant atualizado com sucesso',
      tenant: tenantUpdated,
    };
  }
}
