import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { N8nModule } from 'src/n8n/n8n.module';

@Module({
  controllers: [AgentsController],
  imports: [N8nModule],
})
export class AgentsModule {}
