import { Module } from '@nestjs/common';
import { N8nModule } from 'src/n8n/n8n.module';
import { TenantsController } from './tanants.controller';
import { TenantsService } from './tenants.service';
import { PrismaService } from 'src/databases/prisma.service';

@Module({
  imports: [N8nModule],
  controllers: [TenantsController],
  providers: [TenantsService, PrismaService],
})
export class TenantsModule {}
