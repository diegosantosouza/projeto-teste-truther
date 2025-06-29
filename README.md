# Truther API

Uma API para gerenciamento de dados de criptomoedas e usuários, construída com Node.js, TypeScript, Express e MongoDB.

## Características

- **Arquitetura Limpa**: Implementação seguindo Clean Architecture e SOLID
- **TypeScript**: Código totalmente tipado para maior segurança e produtividade
- **MongoDB**: Banco de dados NoSQL com Mongoose ODM
- **CoinGecko Integration**: Dados atualizados de criptomoedas via API externa
- **Testes**: Cobertura de testes com Jest
- **Docker**: Containerização completa para desenvolvimento e produção
- **CI/CD**: Pipeline automatizado com GitHub Actions

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
- Rate limiting (configurável)
- Headers de segurança
- Usuário não-root no Docker

## Monitoramento

- Health checks automáticos
- Logs estruturados
- Métricas de performance
- Tratamento de erros centralizado

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com Node.js, TypeScript**
