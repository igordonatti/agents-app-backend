import { Body, Controller, Post } from '@nestjs/common';
import { N8nService } from 'src/n8n/n8n.service';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly n8nService: N8nService) {}

  @Post()
  async updateKnowledgeBase(@Body() folder_id: string) {
    const workflowPath = 'upload-files';
    return await this.n8nService.postResource(workflowPath, folder_id);
  }
}
