import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { N8nService } from 'src/n8n/n8n.service';

@ApiTags('Knowledge Base')
@ApiBearerAuth('JWT-auth')
@Controller('knowledge-base')
export class KnowledgeBaseController {
  private readonly devOrProd: boolean;

  constructor(
    private readonly n8nService: N8nService,
    private readonly configService: ConfigService,
  ) {
    this.devOrProd = this.configService.get('DEV_DECIDER');
  }

  @ApiOperation({
    summary: 'Atualizar base de conhecimento',
    description:
      'Processa e atualiza a base de conhecimento de uma pasta específica',
  })
  @ApiBody({
    schema: {
      type: 'string',
      example: 'folder_abc123',
      description: 'ID da pasta a ser processada',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Base de conhecimento atualizada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID da pasta inválido',
  })
  @Post()
  async updateKnowledgeBase(@Body() folder_id: string) {
    const workflowPath = `${this.devOrProd ? 'dev/' : ''}upload-files`;
    return await this.n8nService.postResource(workflowPath, folder_id);
  }
}
