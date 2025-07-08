import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateAgentDto } from './dto/createAgent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly n8nService: N8nService) {}

  @Get()
  async getAgents() {
    const workflowPath = '/agents';
    return await this.n8nService.getResource(workflowPath);
  }

  @Get(':id')
  async getAgentById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @Post()
  async createAgent(@Body() agent: CreateAgentDto) {
    const workflowPath = '/agents';
    return await this.n8nService.postResource(workflowPath, agent);
  }

  @Get('tenant/:id_tenant')
  async getAgentsByTenant(@Param('id_tenant') id_tenant: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/tenant/${id_tenant}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @Delete(':id')
  async deleteAgent(@Param('id') id: string) {
    const workflowPath = 'agents';
    return await this.n8nService.deleteResource(workflowPath, {
      id_agent: id,
    });
  }

  @Patch(':id')
  async updateAgentPrompt(@Param('id') id: string, @Body() prompt: string) {
    const workflowPath = 'upload-prompt';
    return await this.n8nService.patchResource(workflowPath, {
      id_agent: id,
      prompt,
    });
  }

  @Patch('update-name/:id')
  async updateAgentName(@Param('id') id: string, @Body() name: string) {
    const workflowPath = 'agents';
    return await this.n8nService.patchResource(workflowPath, {
      id_agent: id,
      name,
    });
  }
}
