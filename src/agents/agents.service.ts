import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { CreateAgentDto } from './dto/createAgent.dto';
import { convertBigIntToNumber } from 'src/utils/bigint-converter.utils';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAgente(data: CreateAgentDto) {
    const agentExists = await this.prisma.folders.findFirst({
      where: {
        name: data.name,
      },
    });
    const tenantExists = await this.prisma.tenants.findFirst({
      where: {
        id: Number(data.id_tenant),
      },
    });

    if (agentExists) throw new BadRequestException('Agente já existe');
    if (!tenantExists) throw new NotFoundException('Tenant não encontrado');

    const agentCreated = await this.prisma.folders.create({
      data: {
        name: data.name,
        id_folder: data.id_folder,
        prompt: data.prompt || '',
        ice_breakers: data.ice_breakers || [],
        tenant: {
          connect: {
            id: Number(data.id_tenant),
          },
        },
      },
    });

    // Criar pasta no onedrive com o nome do agente e dentro da pasta do tenant

    return {
      message: 'Agente criado com sucesso',
      agent: convertBigIntToNumber(agentCreated),
    };
  }

  async deleteAgent(id: number) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id,
      },
    });

    if (!agent) throw new NotFoundException('Agente não encontrado');

    const agentDeleted = await this.prisma.folders.delete({
      where: {
        id,
      },
    });

    // Deletar pasta no onedrive

    return {
      message: 'Agente deletado com sucesso',
      agent: convertBigIntToNumber(agentDeleted),
    };
  }

  async getAgents() {
    const agents = await this.prisma.folders.findMany();

    return convertBigIntToNumber(agents);
  }

  async getAgentById(id: number) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id,
      },
    });

    if (!agent) throw new NotFoundException('Agente não encontrado');

    return convertBigIntToNumber(agent);
  }

  async getAgentsByTenant(id_tenant: number) {
    const agents = await this.prisma.folders.findMany({
      where: {
        id_tenant,
      },
    });

    return convertBigIntToNumber(agents);
  }

  async updateAgent(id: number, data: CreateAgentDto) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id,
      },
    });

    if (!agent) throw new NotFoundException('Agente não encontrado');

    const agentUpdated = await this.prisma.folders.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });

    // Atualizar pasta no onedrive com o nome do agente

    return {
      message: 'Agente atualizado com sucesso',
      agent: convertBigIntToNumber(agentUpdated),
    };
  }

  async createIceBreaker(data: { text: string; id_agent: number }) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id: data.id_agent,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agente não encontrado');
    }

    if (agent.ice_breakers.length >= 4) {
      throw new BadRequestException('Agente já tem 4 quebras de gelo');
    }

    const createdResponse = await this.prisma.folders.update({
      where: {
        id: data.id_agent,
      },
      data: {
        ice_breakers: {
          push: data.text,
        },
      },
    });

    return convertBigIntToNumber(createdResponse);
  }

  async updateIceBreaker(id: number, index: number, text: string) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agente não encontrado');
    }

    if (index < 0 || index >= agent.ice_breakers.length) {
      throw new BadRequestException('Índice inválido');
    }

    const updatedResponse = await this.prisma.folders.update({
      where: {
        id,
      },
      data: {
        ice_breakers: {
          set: agent.ice_breakers.map((iceBreaker, index) =>
            index === index ? text : iceBreaker,
          ),
        },
      },
    });

    return convertBigIntToNumber(updatedResponse);
  }

  async deleteIceBreaker(id: number, index: number) {
    const agent = await this.prisma.folders.findUnique({
      where: {
        id,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agente não encontrado');
    }

    if (index < 0 || index >= agent.ice_breakers.length) {
      throw new BadRequestException('Índice inválido');
    }

    const deletedResponse = await this.prisma.folders.update({
      where: {
        id,
      },
      data: {
        ice_breakers: {
          set: agent.ice_breakers.filter((_, i) => i !== index),
        },
      },
    });

    return convertBigIntToNumber(deletedResponse);
  }
}
