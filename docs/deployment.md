# Deploy em Produção - Google Cloud Run

Este documento explica como configurar e executar o deploy automático da aplicação no Google Cloud Run.

## Pré-requisitos

1. **Conta Google Cloud Platform (GCP)**
2. **Projeto GCP configurado**
3. **Google Cloud Run API habilitada**
4. **Container Registry API habilitada**
5. **Service Account com permissões adequadas**

## Configuração dos Secrets no GitHub

Para que o workflow funcione corretamente, você precisa configurar os seguintes secrets no repositório GitHub:

### 1. GCP_SA_KEY
Chave JSON da Service Account do Google Cloud Platform com as seguintes permissões:
- Cloud Run Admin
- Storage Admin
- Service Account User

**Como obter:**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Vá para "IAM & Admin" > "Service Accounts"
3. Crie uma nova Service Account ou use uma existente
4. Adicione as permissões necessárias
5. Crie uma nova chave (JSON)
6. Copie o conteúdo JSON completo

### 2. GCP_PROJECT_ID
ID do projeto GCP onde a aplicação será deployada.

**Exemplo:** `meu-projeto-123456`

### 3. GCP_REGION
Região onde o Cloud Run será deployado.

**Exemplos:**
- `us-central1`
- `us-east1`
- `europe-west1`
- `southamerica-east1`

### 4. MONGO_URI
URI de conexão com o MongoDB em produção.

**Formato:** `mongodb+srv://username:password@cluster.mongodb.net/database`

## Configuração dos Secrets

1. Acesse o repositório no GitHub
2. Vá para "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret"
4. Adicione cada um dos secrets listados acima

## Como funciona o Deploy

### Trigger
O deploy é executado automaticamente quando:
- Há um push na branch `main`
- Execução manual via `workflow_dispatch`

### Processo
1. **Checkout do código**
2. **Setup do Node.js**
3. **Instalação de dependências**
4. **Execução dos testes**
5. **Build da aplicação**
6. **Autenticação no Google Cloud**
7. **Build e push da imagem Docker**
8. **Deploy no Cloud Run**
9. **Health check**
10. **Criação de comentário com resumo do deploy**

### Configuração do Cloud Run

O serviço é configurado com:
- **Memória:** 512Mi
- **CPU:** 1 vCPU
- **Instâncias máximas:** 1
- **Instâncias mínimas:** 0 (scale to zero)
- **Timeout:** 300 segundos
- **Porta:** 3000
- **Acesso:** Público (--allow-unauthenticated)

## Endpoints

### Health Check
- **URL:** `https://your-service-url/health`
- **Método:** GET
- **Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## Monitoramento

Após o deploy, você pode monitorar a aplicação através:
- **Google Cloud Console** > Cloud Run
- **Logs:** Cloud Run > Seu serviço > Logs
- **Métricas:** Cloud Run > Seu serviço > Métricas

## Troubleshooting

### Erro de autenticação
- Verifique se o `GCP_SA_KEY` está correto
- Confirme se a Service Account tem as permissões necessárias

### Erro de build
- Verifique se o Dockerfile está correto
- Confirme se todas as dependências estão no package.json

### Erro de deploy
- Verifique se o `GCP_PROJECT_ID` está correto
- Confirme se a `GCP_REGION` existe
- Verifique se as APIs estão habilitadas

### Health check falha
- Verifique se a aplicação está iniciando corretamente
- Confirme se o endpoint `/health` está funcionando
- Verifique os logs do Cloud Run

## Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas :
- `NODE_ENV=production`
- `PORT=3000`
- `MONGO_URI`
- `MONGO_DEBUG=false`
