import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
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

// Decorators específicos para usuários
export const ApiFindUserByEmail = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar usuário por email',
      description: 'Busca um usuário pelo endereço de email',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'usuario@exemplo.com' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário encontrado com sucesso',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_123' },
          email: { type: 'string', example: 'usuario@exemplo.com' },
          name: { type: 'string', example: 'João Silva' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
    ApiBearerAuth('JWT-auth'),
  );

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar novo usuário',
      description: 'Cria um novo usuário no sistema',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_123' },
          email: { type: 'string', example: 'usuario@exemplo.com' },
          name: { type: 'string', example: 'João Silva' },
          created_at: { type: 'string', format: 'date-time' },
          message: { type: 'string', example: 'User created successfully' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou usuário já existe',
    }),
  );
