import { Test, TestingModule } from '@nestjs/testing';
import { N8nService } from './n8n.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import { of, throwError } from 'rxjs';

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'N8N_BASE_URL') return 'http://mock-n8n.com/webhook-waiting';
    if (key === 'N8N_API_KEY') return 'mock-api-key';
    return null;
  }),
};

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
};

describe('N8nService', () => {
  let service: N8nService;
  let httpService: HttpService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        N8nService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<N8nService>(N8nService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postResource', () => {
    it('should call httpService.post with the correct URL, payload, and headers', async () => {
      // Arrange (preparação)
      const workflowPath = 'test/post';
      const payload = { tenant: 'test' };
      const expectedUrl = 'http://mock-n8n.com/webhook-waiting/test/post';

      // Simula a resposta de sucesso do Axios (o conteúdo não importa tanto aqui)
      const mockResponse: AxiosResponse = {
        data: { message: 'ok' },
      } as AxiosResponse;
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // Act (Ação)
      await service.postResource(workflowPath, payload);

      // Assert (Verificação)
      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith(expectedUrl, payload, {
        headers: { 'X-N8N-API-KEY': 'mock-api-key' },
      });
    });
  });

  describe('getResource', () => {
    it('should call httpService.get and return the response data', async () => {
      const workflowPath = 'test/get';
      const mockData = { id: '1', name: 'tenant' };
      const expectedUrl = 'http://mock-n8n.com/webhook-waiting/test/get';

      const mockResponse: AxiosResponse = {
        data: { data: mockData },
      } as AxiosResponse;
      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getResource(workflowPath, { id: '1' });

      // Assert
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith(expectedUrl, {
        headers: { 'X-N8N-API-KEY': 'mock-api-key' },
        params: { year: 2025 },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteResource', () => {
    it('should call httpService.delete with correct URL and params', async () => {
      const workflowPath = 'test/delete';
      const params = { id: '23' };
      const expectedUrl = 'http://mock-n8n.com/webhook-waiting/test/delete';

      const mockResponse: AxiosResponse = {
        data: { success: true },
      } as AxiosResponse;
      mockHttpService.delete.mockReturnValue(of(mockResponse));

      // Act
      await service.deleteResource(workflowPath, params);

      // Assert
      expect(httpService.delete).toHaveBeenCalledTimes(1);
      expect(httpService.delete).toHaveBeenCalledWith(expectedUrl, {
        headers: { 'X-N8N-API-KEY': 'mock-api-key' },
        params: params,
      });
    });
  });

  describe('patchResource', () => {
    it('should call httpService.patch with correct URL, payload, and headers', async () => {
      const workflowPath = 'test/patch';
      const payload = { id: '1', name: 'tenant_test' };
      const expectedUrl = 'http://mock-n8n.com/webhook-waiting/test/patch';

      const mockResponse: AxiosResponse = {
        data: { message: 'ok' },
      } as AxiosResponse;
      mockHttpService.patch.mockReturnValue(mockResponse);

      // Act
      await service.patchResource(workflowPath, payload);

      // Assert
      expect(httpService.patch).toHaveBeenCalledTimes(1);
      expect(httpService.patch).toHaveBeenCalledWith(expectedUrl, payload, {
        headers: { 'X-N8N-API-KEY': 'mock-api-key' },
      });
    });
  });

  describe('when an HTTP call fails', () => {
    it('should throw a formatted error', async () => {
      // Arrange
      const workflowPath = 'test/fail';
      const payload = { data: 'invalid' };

      // Simula um erro do Axios
      const mockError = new AxiosError(
        'Request failed with status code 500',
        '500',
      );
      mockHttpService.post.mockReturnValue(throwError(() => mockError));

      // Act & Assert
      // Usamos `rejects.toThrow` para verificar se a Promise foi rejeitada com o erro esperado
      await expect(service.postResource(workflowPath, payload)).rejects.toThrow(
        'Falha na comunicação (POST) com o n8n: Request failed with status code 500',
      );
    });
  });
});
