import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

// Decorators para respostas comuns
export const ApiCommonResponses = () =>
  applyDecorators(
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 404, description: 'Recurso não encontrado' }),
  );

export const ApiSuccessResponse = (description: string) =>
  applyDecorators(ApiResponse({ status: 200, description }));

export const ApiCreatedResponse = (description: string) =>
  applyDecorators(ApiResponse({ status: 201, description }));

// Decorators específicos para agentes
export const ApiGetAgents = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todos os agentes',
      description: 'Retorna uma lista com todos os agentes de chatbot',
    }),
    ApiSuccessResponse('Lista de agentes retornada com sucesso'),
  );

export const ApiGetAgentById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar agente por ID',
      description: 'Retorna um agente específico pelo seu ID',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiSuccessResponse('Agente encontrado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiCreateAgent = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar novo agente',
      description: 'Cria um novo agente de chatbot',
    }),
    ApiCreatedResponse('Agente criado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiGetAgentsByTenant = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar agentes por tenant',
      description: 'Retorna todos os agentes de um tenant específico',
    }),
    ApiParam({ name: 'id_tenant', description: 'ID do tenant' }),
    ApiSuccessResponse('Lista de agentes do tenant retornada com sucesso'),
  );

export const ApiDeleteAgent = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar agente',
      description: 'Remove um agente do sistema',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiSuccessResponse('Agente deletado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiUpdateAgentPrompt = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar prompt do agente',
      description: 'Atualiza o prompt personalizado de um agente',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiBody({
      schema: {
        type: 'string',
        example: 'Você é um assistente especializado em suporte técnico...',
      },
    }),
    ApiSuccessResponse('Prompt atualizado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiUpdateAgentName = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar nome do agente',
      description: 'Atualiza o nome de um agente',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiBody({
      schema: {
        type: 'string',
        example: 'Novo Nome do Agente',
      },
    }),
    ApiSuccessResponse('Nome atualizado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiCreateIceBreaker = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar quebra-gelo',
      description:
        'Adiciona um novo quebra-gelo a um agente (máximo 4 por agente)',
    }),
    ApiCreatedResponse('Quebra-gelo criado com sucesso'),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou agente já tem 4 quebra-gelos',
    }),
    ApiCommonResponses(),
  );

export const ApiUpdateIceBreaker = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar quebra-gelo',
      description: 'Atualiza um quebra-gelo específico de um agente',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiParam({ name: 'index', description: 'Índice do quebra-gelo (0-3)' }),
    ApiSuccessResponse('Quebra-gelo atualizado com sucesso'),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou índice inválido',
    }),
    ApiCommonResponses(),
  );

export const ApiDeleteIceBreaker = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar quebra-gelo',
      description: 'Remove um quebra-gelo específico de um agente',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiParam({ name: 'index', description: 'Índice do quebra-gelo (0-3)' }),
    ApiSuccessResponse('Quebra-gelo deletado com sucesso'),
    ApiResponse({ status: 400, description: 'Índice inválido' }),
    ApiCommonResponses(),
  );

export const ApiUploadFile = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload de arquivo para agente',
      description: 'Envia um arquivo para o agente através do n8n',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
            description: 'Arquivos a serem enviados',
          },
          agentId: { type: 'string', description: 'ID do agente' },
        },
      },
    }),
    ApiCreatedResponse('Arquivo enviado com sucesso'),
    ApiResponse({
      status: 409,
      description: 'Arquivo já existe na base de conhecimento',
    }),
    ApiCommonResponses(),
  );

export const ApiGetAgentFiles = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar arquivos da base de conhecimento',
      description:
        'Retorna todos os arquivos da base de conhecimento de um agente',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiSuccessResponse('Lista de arquivos retornada com sucesso'),
    ApiCommonResponses(),
  );

export const ApiDeleteAgentFile = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar arquivo da base de conhecimento',
      description:
        'Remove um arquivo específico da base de conhecimento de um agente',
    }),
    ApiParam({ name: 'agentId', description: 'ID do agente' }),
    ApiParam({ name: 'fileId', description: 'ID do arquivo' }),
    ApiSuccessResponse('Arquivo deletado com sucesso'),
    ApiResponse({ status: 400, description: 'IDs inválidos' }),
    ApiCommonResponses(),
  );

export const ApiUpdateCanGenerateImage = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar configuração de geração de imagem',
      description: 'Atualiza se um agente pode gerar imagens ou não',
    }),
    ApiParam({ name: 'id', description: 'ID do agente' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          canGenerateImage: {
            type: 'boolean',
            description: 'Se o agente pode gerar imagens',
            example: true,
          },
        },
        required: ['canGenerateImage'],
      },
    }),
    ApiSuccessResponse(
      'Configuração de geração de imagem atualizada com sucesso',
    ),
    ApiCommonResponses(),
  );
