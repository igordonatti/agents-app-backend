import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ConfigModule } from '@nestjs/config';
import { N8nModule } from 'src/n8n/n8n.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [ConfigModule, N8nModule],
})
export class DashboardModule {}
