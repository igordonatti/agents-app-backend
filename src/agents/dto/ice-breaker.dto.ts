import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIceBreakerDto {
  @ApiProperty({
    description: 'Texto do quebra-gelo',
    example: 'Olá! Como posso ajudá-lo hoje?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'ID do agente',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  id_agent: string;
}

export class UpdateIceBreakerDto {
  @ApiProperty({
    description: 'Novo texto do quebra-gelo',
    example: 'Olá! Posso te ajudar com alguma coisa?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
