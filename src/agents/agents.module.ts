import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { N8nModule } from 'src/n8n/n8n.module';
import { AgentsService } from './agents.service';
import { PrismaService } from 'src/databases/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AgentsController],
  imports: [N8nModule, ConfigModule],
  providers: [AgentsService, PrismaService],
})
export class AgentsModule {}
