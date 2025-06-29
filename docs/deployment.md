# Deploy em Produção

Este documento descreve o processo de deploy da aplicação Truther API para produção usando Google Cloud Run.

## Pré-requisitos

1. **Conta Google Cloud Platform (GCP)**
2. **Projeto GCP configurado**
3. **Google Cloud Run API habilitada**
4. **Artifact Registry API habilitada** (substitui Container Registry)
5. **Service Account com permissões adequadas**

## Configuração dos Secrets no GitHub

Para que o deploy automático funcione, configure os seguintes secrets no repositório GitHub:

### 1. GCP_SA_KEY
Chave JSON da Service Account do Google Cloud Platform com as seguintes permissões:
- Cloud Run Admin
- Storage Admin
- Service Account User
- Artifact Registry Admin (para gerenciar repositórios de imagens)
- Artifact Registry Repository Administrator
- Artifact Registry Writer

**Como obter:**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto
3. Vá para **IAM & Admin** > **Service Accounts**
4. Clique em **Create Service Account**
5. Dê um nome e descrição para a service account
6. Clique em **Create and Continue**
7. Na tela de permissões, adicione os roles mencionados acima
8. Clique em **Done**
9. Na lista de service accounts, clique na que você criou
10. Vá para a aba **Keys**
11. Clique em **Add Key** > **Create new key**
12. Selecione **JSON** como formato
13. Clique em **Create**
14. O arquivo JSON será baixado automaticamente

### 2. GCP_PROJECT_ID
ID do projeto GCP onde a aplicação será deployada.

**Exemplo:** `meu-projeto-123456`

### 3. MONGO_URI
URI de conexão com o MongoDB em produção.

**Formato:** `mongodb+srv://username:password@cluster.mongodb.net/database`

## Como Configurar os Secrets

1. Acesse o repositório no GitHub
2. Vá para **Settings** > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione cada um dos secrets listados acima

## Processo de Deploy

O deploy é executado automaticamente quando:
- Há um push na branch `main`
- Execução manual via `workflow_dispatch`

### Etapas do Processo

1. **Checkout do código** - Baixa o código do repositório
2. **Google Auth** - Autentica com o Google Cloud usando a service account
3. **Setup Cloud SDK** - Configura o Google Cloud SDK
4. **Configure Docker** - Configura Docker para usar Artifact Registry
5. **Create Artifact Registry repository** - Cria o repositório de imagens (se não existir)
6. **Build and push Docker image** - Constrói e faz push da imagem Docker
7. **Deploy to Cloud Run** - Faz deploy da aplicação no Cloud Run
8. **Health check** - Verifica se a aplicação está funcionando
9. **Create deployment summary** - Cria um resumo do deploy

## Configuração do Cloud Run

O serviço é configurado com:
- **Memória:** 512Mi
- **CPU:** 1 vCPU
- **Instâncias máximas:** 1
- **Instâncias mínimas:** 0 (scale to zero)
- **Timeout:** 300 segundos
- **Porta:** 3000
- **Acesso:** Público

## Artifact Registry

O projeto usa o **Artifact Registry** (substituindo o Container Registry que foi descontinuado):

- **Repositório:** `truther-api`
- **Localização:** `us-central1`
- **Formato:** Docker
- **URL do repositório:** `us-central1-docker.pkg.dev/{PROJECT_ID}/truther-api/{IMAGE_NAME}`

## Health Check

Após o deploy, a aplicação fica disponível em:
- **URL:** `https://your-service-url/health`
- **Método:** GET

**Resposta esperada:**
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

### Erro de Container Registry Deprecated
Se você encontrar o erro:
```
Container Registry is deprecated and shutting down
```

Isso significa que o projeto ainda estava usando o Container Registry antigo. O workflow atualizado já resolve isso migrando para o Artifact Registry.

### Erro de Permissões
Se você encontrar erros de permissão, verifique se a service account tem todos os roles necessários:
- Cloud Run Admin
- Storage Admin
- Service Account User
- Artifact Registry Admin

### Erro de Repositório não Encontrado
O workflow automaticamente cria o repositório `truther-api` no Artifact Registry se ele não existir. Se houver problemas, você pode criar manualmente:

```bash
gcloud artifacts repositories create truther-api \
  --repository-format=docker \
  --location=us-central1 \
  --description="Truther API Docker repository"
```

### Erro de Permissão no Artifact Registry
Se você encontrar o erro:
```
Permission "artifactregistry.repositories.uploadArtifacts" denied
```

Siga estes passos:
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **IAM & Admin** > **IAM**
3. Encontre sua service account
4. Clique no lápis (editar) ao lado da service account
5. Adicione estas permissões específicas:
   - **Artifact Registry Admin**
   - **Artifact Registry Repository Administrator**
   - **Artifact Registry Writer**
6. Salve as mudanças
7. Aguarde alguns minutos para as permissões se propagarem
8. Execute o deploy novamente

## Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas :
- `NODE_ENV=production`
- `PORT=3000`
- `MONGO_URI`
- `MONGO_DEBUG=false`
