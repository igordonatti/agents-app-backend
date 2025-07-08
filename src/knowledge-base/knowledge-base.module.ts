import { Module } from '@nestjs/common';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { N8nModule } from 'src/n8n/n8n.module';

@Module({
  controllers: [KnowledgeBaseController],
  imports: [N8nModule],
})
export class KnowledgeBaseModule {}
