import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

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

// Decorators específicos para tenants
export const ApiGetTenants = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todos os tenants',
      description: 'Retorna uma lista com todos os tenants cadastrados',
    }),
    ApiSuccessResponse('Lista de tenants retornada com sucesso'),
  );

export const ApiGetTenantById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar tenant por ID',
      description: 'Retorna um tenant específico pelo seu ID',
    }),
    ApiParam({ name: 'id', description: 'ID do tenant' }),
    ApiSuccessResponse('Tenant encontrado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiCreateTenant = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar novo tenant',
      description: 'Cria um novo tenant/organização no sistema',
    }),
    ApiCreatedResponse('Tenant criado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiUpdateTenantName = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar nome do tenant',
      description: 'Atualiza o nome de um tenant',
    }),
    ApiParam({ name: 'id', description: 'ID do tenant' }),
    ApiBody({
      schema: {
        type: 'string',
        example: 'Novo Nome da Empresa',
      },
    }),
    ApiSuccessResponse('Nome do tenant atualizado com sucesso'),
    ApiCommonResponses(),
  );

export const ApiDeleteTenant = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar tenant',
      description: 'Remove um tenant do sistema',
    }),
    ApiParam({ name: 'id', description: 'ID do tenant' }),
    ApiSuccessResponse('Tenant deletado com sucesso'),
    ApiCommonResponses(),
  );
