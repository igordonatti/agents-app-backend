import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateTenantDto } from './dto/createTenant.dto';
import {
  ApiGetTenants,
  ApiGetTenantById,
  ApiCreateTenant,
  ApiUpdateTenantName,
  ApiDeleteTenant,
} from './decorators/api-docs.decorator';

@ApiTags('Tenants')
@ApiBearerAuth('JWT-auth')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly n8nService: N8nService) {}

  @ApiGetTenants()
  @Get()
  async getTenants() {
    const workflowPath = 'dev/tenants';
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiGetTenantById()
  @Get(':id')
  async getTenantsById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/dev/tenants/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @ApiCreateTenant()
  @Post()
  async createTenant(@Body() tenant: CreateTenantDto) {
    const workflowPath = 'dev/tenants';
    return await this.n8nService.postResource(workflowPath, tenant);
  }

  @ApiUpdateTenantName()
  @Patch(':id')
  async updateTenantName(@Param('id') id: string, @Body() name: string) {
    const workflowPath = 'dev/tenants';
    return await this.n8nService.patchResource(workflowPath, {
      id_tenant: id,
      name,
    });
  }

  @ApiDeleteTenant()
  @Delete(':id')
  async deleteTenant(@Param('id') id: string) {
    const workflowPath = 'dev/tenants';
    return await this.n8nService.deleteResource(workflowPath, {
      id_folder: id,
    });
  }
}
