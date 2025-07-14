import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { N8nModule } from 'src/n8n/n8n.module';
import { AgentsService } from './agents.service';
import { PrismaService } from 'src/databases/prisma.service';

@Module({
  controllers: [AgentsController],
  imports: [N8nModule],
  providers: [AgentsService, PrismaService],
})
export class AgentsModule {}
