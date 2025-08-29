import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DashboardService } from './dashboard.service';
// import { N8nService } from 'src/n8n/n8n.service';

@Controller('dashboard')
export class DashboardController {
  private readonly devOrProd: boolean;

  constructor(
    // private readonly n8nService: N8nService,
    private readonly configService: ConfigService,
    private readonly dashboardService: DashboardService,
  ) {
    this.devOrProd = this.configService.get('DEV_DECIDER');
  }

  @Get(':id')
  async getDataDashboardByID(@Param('id') id: string) {
    return await this.dashboardService.getDashboardData(id);
  }
}
