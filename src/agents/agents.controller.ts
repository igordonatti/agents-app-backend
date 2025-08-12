import {
  Body,
  Controller,
  Delete,
  Get,
  BadRequestException,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateAgentDto } from './dto/createAgent.dto';
import {
  CreateIceBreakerDto,
  UpdateIceBreakerDto,
} from './dto/ice-breaker.dto';
import { AgentsService } from './agents.service';
import {
  ApiGetAgents,
  ApiGetAgentById,
  ApiCreateAgent,
  ApiGetAgentsByTenant,
  ApiDeleteAgent,
  ApiUpdateAgentPrompt,
  ApiUpdateAgentName,
  ApiCreateIceBreaker,
  ApiUpdateIceBreaker,
  ApiDeleteIceBreaker,
  ApiUploadFile,
  ApiGetAgentFiles,
  ApiDeleteAgentFile,
  ApiUpdateCanGenerateImage,
} from './decorators/api-docs.decorator';
import { ConfigService } from '@nestjs/config';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@ApiTags('Agents')
@ApiBearerAuth('JWT-auth')
@Controller('agents')
export class AgentsController {
  private readonly devOrProd: boolean;

  constructor(
    private readonly n8nService: N8nService,
    private readonly agentsService: AgentsService,
    private readonly configService: ConfigService,
  ) {
    this.devOrProd = this.configService.get('DEV_DECIDER');
  }

  @ApiGetAgents()
  @Get()
  async getAgents() {
    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiGetAgentById()
  @Get(':id')
  async getAgentById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3${this.devOrProd ? '/dev' : ''}/agents/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiCreateAgent()
  @Post()
  async createAgent(@Body() agent: CreateAgentDto) {
    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents`;
    return await this.n8nService.postResource(workflowPath, agent);
  }

  @ApiGetAgentsByTenant()
  @Get('tenant/:id_tenant')
  async getAgentsByTenant(@Param('id_tenant') id_tenant: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3${this.devOrProd ? '/dev' : ''}/agents/tenant/${id_tenant}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiDeleteAgent()
  @Delete(':id')
  async deleteAgent(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Id não pode ser vazio');
    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents`;
    return await this.n8nService.deleteResource(workflowPath, {
      id_agent: id,
    });
  }

  @ApiUpdateAgentPrompt()
  @Patch(':id')
  async updateAgentPrompt(@Param('id') id: string, @Body() prompt: string) {
    if (!prompt) throw new BadRequestException('Prompt não pode ser vazio');

    const workflowPath = `${this.devOrProd ? 'dev/' : ''}upload-prompt`;
    return await this.n8nService.postResource(workflowPath, {
      id_agent: id,
      prompt,
    });
  }

  @ApiUpdateAgentName()
  @Patch('update-name/:id')
  async updateAgentName(@Param('id') id: string, @Body() name: string) {
    if (!id) throw new BadRequestException('Id não pode ser vazio');
    if (!name) throw new BadRequestException('Nome não pode ser vazio');

    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents`;
    return await this.n8nService.patchResource(workflowPath, {
      id_agent: id,
      name,
    });
  }

  @ApiCreateIceBreaker()
  @Post('ice-breaker')
  async createIceBreaker(@Body() { text, id_agent }: CreateIceBreakerDto) {
    return await this.agentsService.createIceBreaker({
      text,
      id_agent: id_agent,
    });
  }

  @ApiUpdateIceBreaker()
  @Patch('ice-breaker/:id/:index')
  async updateIceBreaker(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Body() { text }: UpdateIceBreakerDto,
  ) {
    return await this.agentsService.updateIceBreaker(id, index, text);
  }

  @ApiDeleteIceBreaker()
  @Delete('ice-breaker/:id/:index')
  async deleteIceBreaker(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return await this.agentsService.deleteIceBreaker(id, index);
  }

  @ApiUploadFile()
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      preservePath: true,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: MulterFile[],
    @Body('agentId') agentId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Arquivos não foram enviados');
    }

    if (!agentId) {
      throw new BadRequestException('ID do agente é obrigatório');
    }

    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents/doc`;

    const fileData = files.map((file) => ({
      buffer: file.buffer,
      originalname: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      mimetype: file.mimetype,
      size: file.size,
    }));

    const response = await this.n8nService.postFiles(
      workflowPath,
      fileData,
      agentId,
    );

    // Verifica se o arquivo já existe
    if (response && typeof response === 'object' && 'message' in response) {
      const responseObj = response as { message: string };
      if (responseObj.message === 'Arquivo já existe na base de conhecimento') {
        throw new ConflictException(
          'Arquivo já existe na base de conhecimento',
        );
      }
    }

    return response;
  }

  @ApiGetAgentFiles()
  @Get('files/:id')
  async getAgentFiles(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID do agente é obrigatório');
    }

    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3${this.devOrProd ? '/dev' : ''}/agents/file/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiDeleteAgentFile()
  @Delete('files/:agentId/:fileId')
  async deleteAgentFile(
    @Param('agentId') agentId: string,
    @Param('fileId') fileId: string,
  ) {
    if (!agentId) {
      throw new BadRequestException('ID do agente é obrigatório');
    }
    if (!fileId) {
      throw new BadRequestException('ID do arquivo é obrigatório');
    }

    const workflowPath = `${this.devOrProd ? 'dev/' : ''}agents/doc`;
    return await this.n8nService.deleteResource(workflowPath, {
      id_agent: agentId,
      id_file: fileId,
    });
  }

  @ApiUpdateCanGenerateImage()
  @Patch('can-generate-image/:id')
  async updateCanGenerateImage(
    @Param('id') id: string,
    @Body() { canGenerateImage }: { canGenerateImage: boolean },
  ) {
    return await this.agentsService.updateCanGenerateImage(
      id,
      canGenerateImage,
    );
  }
}
