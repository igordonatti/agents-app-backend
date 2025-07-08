import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { N8nService } from 'src/n8n/n8n.service';
import { CreateTenantDto } from './dto/createTenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly n8nService: N8nService) {}

  @Get()
  async getTenants() {
    const workflowPath = '/tenants';
    return await this.n8nService.getResource(workflowPath);
  }

  @Get(':id')
  async getTenantsById(@Param('id') id: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/tenants/${id}`;
    return await this.n8nService.getResource(workflowPath);
  }

  @Post()
  async createTenant(@Body() tenant: CreateTenantDto) {
    const workflowPath = '/tenants';
    return await this.n8nService.postResource(workflowPath, tenant);
  }

  @Patch(':id')
  async updateTenantName(@Param('id') id: string, @Body() name: string) {
    const workflowPath = 'tenants';
    return await this.n8nService.patchResource(workflowPath, {
      id_tenant: id,
      name,
    });
  }

  @Delete(':id')
  async deleteTenant(@Param('id') id: string) {
    const workflowPath = 'tenants';
    return await this.n8nService.deleteResource(workflowPath, {
      id_folder: id,
    });
  }
}
