# Truther API

Uma API para gerenciamento de dados de criptomoedas e usuários, construída com Node.js, TypeScript, Express e MongoDB.

## Endereço da API
```bash
https://truther-api-706208818538.us-central1.run.app
```

## Características

- **Arquitetura Limpa**: Implementação seguindo Clean Architecture e SOLID
- **TypeScript**: Código totalmente tipado para maior segurança e produtividade
- **MongoDB**: Banco de dados NoSQL com Mongoose ODM
- **CoinGecko Integration**: Dados atualizados de criptomoedas via API externa
- **Testes**: Cobertura de testes com Jest
- **Docker**: Containerização completa para desenvolvimento e produção
- **CI/CD**: Pipeline automatizado com GitHub Actions
- **Deploy Automático**: Deploy contínuo no Google Cloud Run

## Pré-requisitos

- Node.js >= 22.0.0
- MongoDB >= 7.0
- Docker
- npm ou yarn

## Instalação

### Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd projeto-teste-truther

# Instale as dependências
npm install

# Edite o arquivo .env.local com suas configurações
.env.local
```

### Variáveis de Ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
# Ambiente
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/truther-api
MONGO_DEBUG=true

# CoinGecko API
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_api_key_here
```

## Executando a Aplicação

### Desenvolvimento

```bash
# Desenvolvimento com hot reload
npm run dev

# Debug com hot reload
npm run debug:watch

# Debug simples
npm run debug
```

### Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

### Docker

```bash
# Iniciar banco de dados
docker-compose up -d
```

## Deploy em Produção

O projeto está configurado para deploy automático no Google Cloud Run através do GitHub Actions.

### Pré-requisitos para Deploy

1. **Conta Google Cloud Platform (GCP)**
2. **Projeto GCP configurado**
3. **Google Cloud Run API habilitada**
4. **Container Registry API habilitada**
5. **Service Account com permissões adequadas**

### Configuração dos Secrets no GitHub

Para que o deploy automático funcione, configure os seguintes secrets no repositório GitHub:

#### 1. GCP_SA_KEY
Chave JSON da Service Account do Google Cloud Platform com as seguintes permissões:
- Cloud Run Admin
- Storage Admin
- Service Account User
- Artifact Registry Admin (para gerenciar repositórios de imagens)

**Como obter:**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Vá para "IAM & Admin" > "Service Accounts"
3. Crie uma nova Service Account ou use uma existente
4. Adicione as permissões necessárias
5. Crie uma nova chave (JSON)
6. Copie o conteúdo JSON completo

#### 2. GCP_PROJECT_ID
ID do projeto GCP onde a aplicação será deployada.

**Exemplo:** `meu-projeto-123456`

#### 3. MONGO_URI
URI de conexão com o MongoDB em produção.

**Formato:** `mongodb+srv://username:password@cluster.mongodb.net/database`

### Como Configurar os Secrets

1. Acesse o repositório no GitHub
2. Vá para "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret"
4. Adicione cada um dos secrets listados acima

### Processo de Deploy

O deploy é executado automaticamente quando:
- Há um push na branch `main`
- Execução manual via `workflow_dispatch`

**Etapas do processo:**
1. Checkout do código
2. Setup do Node.js
3. Instalação de dependências
4. Build da aplicação
5. Autenticação no Google Cloud
6. Build e push da imagem Docker
7. Deploy no Cloud Run
8. Health check
9. Criação de comentário com resumo do deploy

### Configuração do Cloud Run

O serviço é configurado com:
- **Memória:** 512Mi
- **CPU:** 1 vCPU
- **Instâncias máximas:** 1
- **Instâncias mínimas:** 0 (scale to zero)
- **Timeout:** 300 segundos
- **Porta:** 3000
- **Acesso:** Público

### Health Check

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

### Monitoramento

Após o deploy, você pode monitorar a aplicação através:
- **Google Cloud Console** > Cloud Run
- **Logs:** Cloud Run > Seu serviço > Logs
- **Métricas:** Cloud Run > Seu serviço > Métricas

Para documentação completa de deployment, consulte: [`/docs/deployment.md`](./docs/deployment.md)

## Documentação da API

### Módulo de Usuários

Para documentação completa do módulo de usuários, consulte: [`/docs/users.md`](./docs/users.md)

#### Endpoints Disponíveis

- `POST /users` - Criar usuário
- `GET /users` - Listar usuários (com filtros opcionais)
- `GET /users/:id` - Buscar usuário específico
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

#### Exemplo de Criação de Usuário

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "roles": ["client"]
}
```

### Módulo de Criptomoedas

Para documentação completa do módulo de criptomoedas, consulte: [`/docs/coins.md`](./docs/coins.md)

#### Endpoints Disponíveis

- `GET /coins` - Listar todas as criptomoedas
- `GET /coins/:coinId` - Buscar criptomoeda específica

#### Criptomoedas Suportadas

- `bitcoin` (Bitcoin)
- `ethereum` (Ethereum)
- `solana` (Solana)
- `binancecoin` (Binance Coin)
- `tether` (Tether)
- `dogecoin` (Dogecoin)
- `litecoin` (Litecoin)

## Testes

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes verbosos
npm run test:verbose
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Hot reload com TSX
npm run debug            # Debug simples
npm run debug:watch      # Debug com hot reload

# Build
npm run build            # Compilar TypeScript
npm run clean            # Limpar dist/

# Qualidade de Código
npm run lint             # ESLint
npm run lint:fix         # ESLint com auto-fix
npm run format           # Prettier
npm run format:check     # Verificar formatação
npm run code:check       # Lint + Format check
npm run code:fix         # Lint + Format fix

# Testes
npm test                 # Jest
npm run test:watch       # Jest watch
npm run test:coverage    # Jest com coverage
npm run test:verbose     # Jest verbose
```

## Arquitetura

O projeto segue Clean Architecture com a seguinte estrutura:

```
src/
├── modules/
│   ├── coins/           # Módulo de criptomoedas
│   │   ├── controllers/ # Controladores HTTP
│   │   ├── usecases/    # Casos de uso
│   │   ├── entities/    # Entidades de domínio
│   │   ├── repositories/# Repositórios
│   │   └── ...
│   └── user/            # Módulo de usuários
│       ├── controllers/ # Controladores HTTP
│       ├── usecases/    # Casos de uso
│       ├── entities/    # Entidades de domínio
│       ├── repositories/# Repositórios
│       └── ...
├── shared/              # Código compartilhado
│   ├── config/          # Configurações
│   ├── http/            # Cliente HTTP
│   ├── providers/       # Provedores externos
│   │   ├── adapter/     # Adaptadores (ex: marketDataToCoin)
│   │   └── coingecko/   # Provider CoinGecko
│   └── ...
└── infrastructure/      # Infraestrutura
    └── database/        # Configuração do banco
```

## Sistema de Cache Inteligente

O sistema implementa uma estratégia robusta para lidar com rate limits da API CoinGecko:

1. **Tentativa Primária**: Sempre tenta buscar dados atualizados
2. **Fallback para Cache**: Se a API falhar, usa dados em cache
3. **Atualização Automática**: Atualiza cache quando API está disponível
4. **Disponibilidade Contínua**: Garante funcionamento mesmo com API indisponível

Para mais detalhes sobre o sistema de cache, consulte: [`/docs/coins.md`](./docs/coins.md)

## Desenvolvimento

Para informações detalhadas sobre desenvolvimento, debugging e configuração, consulte: [`/docs/development.md`](./docs/development.md)

## Segurança

- Senhas hasheadas com bcrypt
- Validação de entrada com Zod
- Usuário não-root no Docker

## Monitoramento

- Health checks automáticos
- Logs estruturados
- Tratamento de erros centralizado

---

**Desenvolvido com Node.js, TypeScript**
