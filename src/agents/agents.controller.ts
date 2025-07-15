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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateAgentDto } from './dto/createAgent.dto';
import {
  CreateIceBreakerDto,
  UpdateIceBreakerDto,
} from './dto/ice-breaker.dto';
import { AgentsService } from './agents.service';

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
  constructor(
    private readonly n8nService: N8nService,
    private readonly agentsService: AgentsService,
  ) {}

  @ApiOperation({
    summary: 'Listar todos os agentes',
    description: 'Retorna uma lista com todos os agentes de chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de agentes retornada com sucesso',
  })
  @Get()
  async getAgents() {
    const workflowPath = 'agents';
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Buscar agente por ID',
    description: 'Retorna um agente específico pelo seu ID',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiResponse({
    status: 200,
    description: 'Agente encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Get(':id')
  async getAgentById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Criar novo agente',
    description: 'Cria um novo agente de chatbot',
  })
  @ApiResponse({
    status: 201,
    description: 'Agente criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @Post()
  async createAgent(@Body() agent: CreateAgentDto) {
    const workflowPath = 'agents';
    return await this.n8nService.postResource(workflowPath, agent);
  }

  @ApiOperation({
    summary: 'Listar agentes por tenant',
    description: 'Retorna todos os agentes de um tenant específico',
  })
  @ApiParam({ name: 'id_tenant', description: 'ID do tenant' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agentes do tenant retornada com sucesso',
  })
  @Get('tenant/:id_tenant')
  async getAgentsByTenant(@Param('id_tenant') id_tenant: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/tenant/${id_tenant}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Deletar agente',
    description: 'Remove um agente do sistema',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiResponse({
    status: 200,
    description: 'Agente deletado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Delete(':id')
  async deleteAgent(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Id não pode ser vazio');
    const workflowPath = 'agents';
    return await this.n8nService.deleteResource(workflowPath, {
      id_agent: id,
    });
  }

  @ApiOperation({
    summary: 'Atualizar prompt do agente',
    description: 'Atualiza o prompt personalizado de um agente',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiBody({
    schema: {
      type: 'string',
      example: 'Você é um assistente especializado em suporte técnico...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Prompt atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Prompt inválido',
  })
  @Patch(':id')
  async updateAgentPrompt(@Param('id') id: string, @Body() prompt: string) {
    if (!prompt) throw new BadRequestException('Prompt não pode ser vazio');

    const workflowPath = 'upload-prompt';
    return await this.n8nService.postResource(workflowPath, {
      id_agent: id,
      prompt,
    });
  }

  @ApiOperation({
    summary: 'Atualizar nome do agente',
    description: 'Atualiza o nome de um agente',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiBody({
    schema: {
      type: 'string',
      example: 'Novo Nome do Agente',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Nome atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Nome inválido',
  })
  @Patch('update-name/:id')
  async updateAgentName(@Param('id') id: string, @Body() name: string) {
    if (!id) throw new BadRequestException('Id não pode ser vazio');
    if (!name) throw new BadRequestException('Nome não pode ser vazio');

    const workflowPath = 'agents';
    return await this.n8nService.patchResource(workflowPath, {
      id_agent: id,
      name,
    });
  }

  @ApiOperation({
    summary: 'Criar quebra-gelo',
    description:
      'Adiciona um novo quebra-gelo a um agente (máximo 4 por agente)',
  })
  @ApiResponse({
    status: 201,
    description: 'Quebra-gelo criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou agente já tem 4 quebra-gelos',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Post('ice-breaker')
  async createIceBreaker(@Body() { text, id_agent }: CreateIceBreakerDto) {
    return await this.agentsService.createIceBreaker({
      text,
      id_agent: Number(id_agent),
    });
  }

  @ApiOperation({
    summary: 'Upload de arquivo para agente',
    description: 'Envia um arquivo para o agente através do n8n',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Arquivos a serem enviados',
        },
        agentId: {
          type: 'string',
          description: 'ID do agente',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo não enviado ou inválido',
  })
  @ApiResponse({
    status: 409,
    description: 'Arquivo já existe na base de conhecimento',
  })
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

    const workflowPath = 'agents/doc';

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

    console.log(response);
    return response;
  }

  @ApiOperation({
    summary: 'Atualizar quebra-gelo',
    description: 'Atualiza um quebra-gelo específico de um agente',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiParam({ name: 'index', description: 'Índice do quebra-gelo (0-3)' })
  @ApiResponse({
    status: 200,
    description: 'Quebra-gelo atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou índice inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Patch('ice-breaker/:id/:index')
  async updateIceBreaker(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
    @Body() { text }: UpdateIceBreakerDto,
  ) {
    return await this.agentsService.updateIceBreaker(id, index, text);
  }

  @ApiOperation({
    summary: 'Deletar quebra-gelo',
    description: 'Remove um quebra-gelo específico de um agente',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiParam({ name: 'index', description: 'Índice do quebra-gelo (0-3)' })
  @ApiResponse({
    status: 200,
    description: 'Quebra-gelo deletado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Índice inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Delete('ice-breaker/:id/:index')
  async deleteIceBreaker(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return await this.agentsService.deleteIceBreaker(id, index);
  }

  @ApiOperation({
    summary: 'Buscar arquivos da base de conhecimento',
    description:
      'Retorna todos os arquivos da base de conhecimento de um agente',
  })
  @ApiParam({ name: 'id', description: 'ID do agente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arquivos retornada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente não encontrado',
  })
  @Get('files/:id')
  async getAgentFiles(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID do agente é obrigatório');
    }

    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/file/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Deletar arquivo da base de conhecimento',
    description:
      'Remove um arquivo específico da base de conhecimento de um agente',
  })
  @ApiParam({ name: 'agentId', description: 'ID do agente' })
  @ApiParam({ name: 'fileId', description: 'ID do arquivo' })
  @ApiResponse({
    status: 200,
    description: 'Arquivo deletado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'IDs inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Agente ou arquivo não encontrado',
  })
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

    const workflowPath = `agents/doc`;
    return await this.n8nService.deleteResource(workflowPath, {
      id_agent: agentId,
      id_file: fileId,
    });
  }
}
