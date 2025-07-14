# 🚀 Guia de Deployment - Config Chatbot API

Este documento contém informações técnicas sobre deployment, configuração de produção e arquitetura do sistema.

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

```mermaid
graph TB
    subgraph "Client Layer"
        A[Frontend Apps]
        B[Mobile Apps]
        C[Third-party Integrations]
    end
    
    subgraph "API Gateway"
        D[Load Balancer]
        E[Rate Limiting]
        F[CORS]
    end
    
    subgraph "Application Layer"
        G[NestJS API]
        H[Authentication Service]
        I[Agents Service]
        J[Tenants Service]
        K[Knowledge Base Service]
    end
    
    subgraph "Integration Layer"
        L[N8N Workflows]
        M[File Storage]
        N[External APIs]
    end
    
    subgraph "Data Layer"
        O[PostgreSQL]
        P[Redis Cache]
        Q[File System]
    end
    
    A --> D
    B --> D
    C --> D
    D --> G
    G --> H
    G --> I
    G --> J
    G --> K
    I --> L
    K --> M
    G --> O
    G --> P
    M --> Q
    L --> N
```

### Componentes Principais

| Componente | Tecnologia | Responsabilidade |
|------------|------------|------------------|
| **API Core** | NestJS + TypeScript | Lógica de negócio e rotas |
| **Database** | PostgreSQL + Prisma | Persistência de dados |
| **Cache** | Redis | Cache de sessões e dados |
| **Authentication** | JWT + Passport | Autenticação e autorização |
| **File Processing** | N8N + Custom Logic | Processamento de documentos |
| **Documentation** | Swagger/OpenAPI | Documentação automática |

---

## 🐳 Docker Configuration

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/config_chatbot
      - DIRECT_URL=postgresql://postgres:password@db:5432/config_chatbot
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - chatbot-network
    restart: unless-stopped
    volumes:
      - app-logs:/app/logs

  # Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=config_chatbot
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - chatbot-network
    restart: unless-stopped

  # Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - chatbot-network
    restart: unless-stopped
    command: redis-server --appendonly yes

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - chatbot-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
  app-logs:

networks:
  chatbot-network:
    driver: bridge
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app_servers {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE+AESGCM:ECDHE+AES256:ECDHE+AES128:!aNULL:!MD5:!DSS;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        location / {
            # Rate limiting
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://app_servers;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_send_timeout 300;
        }

        # Health check endpoint
        location /health {
            access_log off;
            proxy_pass http://app_servers;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### ECS Fargate

```yaml
# ecs-task-definition.json
{
  "family": "config-chatbot-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "config-chatbot-api",
      "image": "YOUR_ECR_REPOSITORY_URI:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:chatbot/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:chatbot/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/config-chatbot-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### CloudFormation Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Config Chatbot API Infrastructure'

Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
  SubnetIds:
    Type: List<AWS::EC2::Subnet::Id>
  
Resources:
  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: config-chatbot-cluster

  # Application Load Balancer
  ALB:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: config-chatbot-alb
      Scheme: internet-facing
      Type: application
      Subnets: !Ref SubnetIds
      SecurityGroups: [!Ref ALBSecurityGroup]

  # Target Group
  TargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: config-chatbot-targets
      Port: 3000
      Protocol: HTTP
      VpcId: !Ref VpcId
      TargetType: ip
      HealthCheckPath: /health
      HealthCheckProtocol: HTTP

  # RDS PostgreSQL
  DBInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: config-chatbot-db
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.4'
      MasterUsername: postgres
      MasterUserPassword: !Ref DBPassword
      AllocatedStorage: 20
      VPCSecurityGroups: [!Ref RDSSecurityGroup]
      DBSubnetGroupName: !Ref DBSubnetGroup

  # ElastiCache Redis
  RedisCluster:
    Type: AWS::ElastiCache::CacheCluster
    Properties:
      CacheNodeType: cache.t3.micro
      Engine: redis
      NumCacheNodes: 1
      VpcSecurityGroupIds: [!Ref RedisSecurityGroup]
```

### Google Cloud Platform

#### Cloud Run Deployment

```yaml
# cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/ingress-status: all
  name: config-chatbot-api
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 100
      containers:
      - image: gcr.io/PROJECT_ID/config-chatbot-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              key: latest
              name: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              key: latest
              name: jwt-secret
        resources:
          limits:
            cpu: "1"
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
      serviceAccountName: chatbot-service-account
  traffic:
  - percent: 100
    latestRevision: true
```

---

## 🔧 Configuração de Produção

### Variáveis de Ambiente

```bash
# Database
DATABASE_URL="postgresql://user:pass@prod-host:5432/chatbot_prod"
DIRECT_URL="postgresql://user:pass@prod-host:5432/chatbot_prod"

# Security
JWT_SECRET="your-super-secure-jwt-secret-key-here"
BCRYPT_ROUNDS=12

# Server
NODE_ENV="production"
PORT=3000

# Logging
LOG_LEVEL="info"
LOG_FORMAT="json"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN="https://your-frontend-domain.com"

# Monitoring
SENTRY_DSN="your-sentry-dsn-here"
NEW_RELIC_LICENSE_KEY="your-newrelic-key"

# Cache
REDIS_URL="redis://redis-host:6379"
CACHE_TTL=3600

# N8N Integration
N8N_BASE_URL="https://your-n8n-instance.com"
N8N_API_KEY="your-n8n-api-key"

# File Storage
STORAGE_TYPE="s3"  # local, s3, gcs
AWS_REGION="us-east-1"
S3_BUCKET="chatbot-files-bucket"
```

### Configuração de Segurança

```typescript
// src/config/security.config.ts
import { ConfigService } from '@nestjs/config';

export const securityConfig = (configService: ConfigService) => ({
  // Helmet configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  // Rate limiting
  throttler: {
    ttl: configService.get('RATE_LIMIT_WINDOW_MS', 900000),
    limit: configService.get('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  // CORS
  cors: {
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Session security
  session: {
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});
```

---

## 📊 Monitoring e Observabilidade

### Health Checks

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
  ) {}

  @Get()
  @isPublic()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database'),
      () => this.checkMemoryUsage(),
      () => this.checkDiskSpace(),
    ]);
  }

  private async checkMemoryUsage() {
    const used = process.memoryUsage();
    const threshold = 1024 * 1024 * 1024; // 1GB
    
    return {
      memory: {
        status: used.heapUsed < threshold ? 'up' : 'down',
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      },
    };
  }

  private async checkDiskSpace() {
    // Implementation for disk space check
    return { disk: { status: 'up' } };
  }
}
```

### Logging Configuration

```typescript
// src/config/logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
```

### Metrics with Prometheus

```typescript
// src/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'chatbot_api_',
        },
      },
    }),
  ],
})
export class MetricsModule {}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test
      env:
        DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db
    
    - name: Run e2e tests
      run: npm run test:e2e
      env:
        DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: config-chatbot-api
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster config-chatbot-cluster \
          --service config-chatbot-service \
          --force-new-deployment
```

---

## 🔒 Security Best Practices

### 1. Environment Security
- Use AWS Secrets Manager or similar for sensitive data
- Rotate secrets regularly
- Implement least privilege access
- Use VPC for network isolation

### 2. Application Security
- Input validation on all endpoints
- SQL injection prevention (Prisma helps with this)
- XSS protection headers
- Rate limiting to prevent abuse
- JWT token expiration and refresh strategy

### 3. Database Security
- Connection encryption (SSL/TLS)
- Regular backups
- Read replicas for scaling
- Database user with minimal permissions

### 4. Infrastructure Security
- Container image scanning
- Network segmentation
- Web Application Firewall (WAF)
- DDoS protection
- SSL/TLS certificates

---

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Indexes for better performance
CREATE INDEX CONCURRENTLY idx_folders_tenant_id ON folders(id_tenant);
CREATE INDEX CONCURRENTLY idx_documents_folder_id ON documents_info(folder_id);
CREATE INDEX CONCURRENTLY idx_folders_name ON folders(name);
CREATE INDEX CONCURRENTLY idx_user_email ON "User"(email);
```

### 2. Caching Strategy
```typescript
// Redis caching implementation
@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

### 3. Connection Pooling
```typescript
// Prisma connection optimization
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings
  __internal: {
    engine: {
      connectionLimit: 10,
    },
  },
});
```

---

## 📞 Suporte e Manutenção

### Comandos Úteis

```bash
# Deployment
docker-compose up -d --build
docker-compose logs -f app

# Database maintenance
npx prisma migrate deploy
npx prisma db push
npx prisma studio

# Monitoring
docker stats
docker system df
docker system prune

# Backup
pg_dump -h localhost -U postgres -d config_chatbot > backup.sql
```

### Troubleshooting

1. **Container não inicia**
   - Verificar logs: `docker logs container_name`
   - Verificar variáveis de ambiente
   - Verificar conectividade com banco

2. **Erro de conexão com banco**
   - Verificar DATABASE_URL
   - Verificar se PostgreSQL está rodando
   - Verificar permissões de rede

3. **Performance ruim**
   - Verificar índices do banco
   - Verificar uso de memória
   - Implementar cache Redis

Para suporte adicional: **igordonatti.id@gmail.com** 