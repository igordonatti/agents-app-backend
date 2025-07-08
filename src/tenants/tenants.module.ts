import { Module } from '@nestjs/common';
import { N8nModule } from 'src/n8n/n8n.module';
import { TenantsController } from './tanants.controller';

@Module({
  imports: [N8nModule],
  controllers: [TenantsController],
})
export class TenantsModule {}
