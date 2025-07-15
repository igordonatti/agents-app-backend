import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateTenantDto } from './dto/createTenant.dto';

@ApiTags('Tenants')
@ApiBearerAuth('JWT-auth')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly n8nService: N8nService) {}

  @ApiOperation({
    summary: 'Listar todos os tenants',
    description: 'Retorna uma lista com todos os tenants cadastrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tenants retornada com sucesso',
  })
  @Get()
  async getTenants() {
    const workflowPath = 'tenants';
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Buscar tenant por ID',
    description: 'Retorna um tenant específico pelo seu ID',
  })
  @ApiParam({ name: 'id', description: 'ID do tenant' })
  @ApiResponse({
    status: 200,
    description: 'Tenant encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant não encontrado',
  })
  @Get(':id')
  async getTenantsById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/tenants/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiOperation({
    summary: 'Criar novo tenant',
    description: 'Cria um novo tenant/organização no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Tenant criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @Post()
  async createTenant(@Body() tenant: CreateTenantDto) {
    const workflowPath = 'tenants';
    return await this.n8nService.postResource(workflowPath, tenant);
  }

  @ApiOperation({
    summary: 'Atualizar nome do tenant',
    description: 'Atualiza o nome de um tenant',
  })
  @ApiParam({ name: 'id', description: 'ID do tenant' })
  @ApiBody({
    schema: {
      type: 'string',
      example: 'Novo Nome da Empresa',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Nome do tenant atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Nome inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant não encontrado',
  })
  @Patch(':id')
  async updateTenantName(@Param('id') id: string, @Body() name: string) {
    const workflowPath = 'tenants';
    return await this.n8nService.patchResource(workflowPath, {
      id_tenant: id,
      name,
    });
  }

  @ApiOperation({
    summary: 'Deletar tenant',
    description: 'Remove um tenant do sistema',
  })
  @ApiParam({ name: 'id', description: 'ID do tenant' })
  @ApiResponse({
    status: 200,
    description: 'Tenant deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant não encontrado',
  })
  @Delete(':id')
  async deleteTenant(@Param('id') id: string) {
    const workflowPath = 'tenants';
    return await this.n8nService.deleteResource(workflowPath, {
      id_folder: id,
    });
  }
}
