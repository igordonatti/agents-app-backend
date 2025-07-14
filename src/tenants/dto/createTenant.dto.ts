import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nome do tenant/organização',
    example: 'Empresa ABC Ltda',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
