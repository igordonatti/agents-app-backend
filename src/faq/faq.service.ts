import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class FaqService implements OnModuleInit {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL'),
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Conectado ao Redis!');
  }

  async getFaq(id: string) {
    const chaves = await this.client.keys(`${id}*`);
    const cachedFaq = await this.client.get(chaves[0]);

    console.log('cachedFaq: ', JSON.stringify(cachedFaq));

    return JSON.stringify(cachedFaq) || [];
  }
}
