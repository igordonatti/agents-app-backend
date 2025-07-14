import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({
    description: 'Nome do agente de chatbot',
    example: 'Agente de Suporte Técnico',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID único da pasta no sistema de arquivos',
    example: 'folder_abc123',
  })
  @IsString()
  @IsNotEmpty()
  id_folder: string;

  @ApiProperty({
    description: 'ID do tenant ao qual o agente pertence',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id_tenant: string;

  @ApiPropertyOptional({
    description: 'Prompt personalizado para o agente',
    example: 'Você é um assistente de suporte técnico especializado em...',
  })
  @IsString()
  @IsOptional()
  prompt?: string;

  @ApiPropertyOptional({
    description: 'Lista de mensagens quebra-gelo para iniciar conversas',
    example: [
      'Olá! Como posso ajudá-lo hoje?',
      'Precisa de ajuda com alguma coisa?',
    ],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsOptional()
  ice_breakers?: string[];
}
