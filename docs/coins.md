# Módulo de Coins

## Visão Geral

O módulo de coins implementa um sistema de gerenciamento de dados de criptomoedas. O módulo é responsável por buscar dados atualizados de criptomoedas através da API do CoinGecko, armazenar esses dados em cache no MongoDB e fornecer endpoints para consulta de informações de moedas específicas e listagem de todas as moedas disponíveis.

**Importante**: A API do CoinGecko possui rate limits que podem impedir o fluxo normal de busca de dados. Para contornar essa limitação, o sistema implementa uma estratégia de cache inteligente:

1. **Tentativa Primária**: Sempre tenta buscar dados atualizados da API do CoinGecko
2. **Fallback para Cache**: Se a API retornar erro (incluindo rate limit), o sistema busca os dados em cache no banco de dados MongoDB
3. **Atualização Automática**: Quando a API está disponível, os dados são automaticamente atualizados no banco de dados MongoDB
4. **Disponibilidade Contínua**: Garante que o sistema continue funcionando mesmo quando a API externa está indisponível

Esta abordagem garante alta disponibilidade, mantendo os dados sempre acessíveis para os usuários.

## Estrutura do Módulo

```
src/modules/coins/
├── adapter/              # Adaptadores para conversão de dados
├── controllers/          # Controladores HTTP
├── dto/                  # Data Transfer Objects
├── entities/             # Entidades de domínio
├── entrypoints/          # Pontos de entrada da aplicação
├── factories/            # Factories para injeção de dependência
├── repositories/         # Repositórios de dados
├── schemas/              # Schemas do MongoDB
├── usecases/             # Casos de uso
└── index.ts              # Arquivo de exportação principal
```

## Entidades

### Coin

A entidade principal do módulo representa uma criptomoeda no sistema.

```typescript
export type Coin = BaseModel & {
  coinId: CoinsNameEnum;
  name: string;
  marketCap: number;
  priceChangePercentage24h?: number;
  priceChangePercentage7d?: number;
  lowestPrice?: number;
  highestPrice?: number;
  currentPrice: number;
};
```

### CoinsNameEnum

Enum que define as criptomoedas suportadas pelo sistema.

```typescript
export enum CoinsNameEnum {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  BINANCE_COIN = 'binancecoin',
  TETHER = 'tether',
  DOGECOIN = 'dogecoin',
  LITECOIN = 'litecoin',
}
```

## Schemas (MongoDB)

### CoinSchema

Schema do MongoDB para a coleção de coins com as seguintes características:

- **coinId**: String obrigatória com índice e enum dos valores válidos
- **name**: String obrigatória com índice
- **marketCap**: Number obrigatório (capitalização de mercado)
- **priceChangePercentage24h**: Number opcional (variação percentual em 24h)
- **priceChangePercentage7d**: Number opcional (variação percentual em 7 dias)
- **lowestPrice**: Number opcional (preço mais baixo histórico - ATL)
- **highestPrice**: Number opcional (preço mais alto histórico - ATH)
- **currentPrice**: Number obrigatório (preço atual)
- **timestamps**: Automático (createdAt, updatedAt)

## DTOs (Data Transfer Objects)

### CoinIdInput
```typescript
{
  coinId: CoinsNameEnum;  // ID da moeda válido do enum
}
```

### CoinShowInput
```typescript
{
  coinId: CoinsNameEnum;  // ID da moeda para buscar
}
```

### CoinShowOutput
```typescript
Coin;  // Dados completos da moeda
```

### CoinListOutput
```typescript
Coin[];  // Array com todas as moedas
```

## Casos de Uso (Use Cases)

### CoinShowUseCase

**Responsabilidade**: Buscar dados atualizados de uma criptomoeda específica.

**Fluxo**:
1. Tenta buscar dados atualizados da API do CoinGecko
2. Se a API retornar dados, converte usando `marketDataToCoin`
3. Faz upsert no repositório (atualiza se existir, cria se não existir)
4. Se a API falhar, busca dados em cache do banco de dados
5. Se não encontrar em cache, lança `NotFoundError`
6. Retorna os dados da moeda

**Dependências**:
- `CoinRepository`
- `MarketData` (provedor CoinGecko)
- `marketDataToCoin` (adaptador)
- `NotFoundError`
- `ServerError`

### CoinListUseCase

**Responsabilidade**: Listar todas as criptomoedas disponíveis no sistema.

**Fluxo**:
1. Busca todas as moedas no repositório
2. Retorna lista de todas as moedas

**Dependências**:
- `CoinRepository`

## Controladores HTTP

### CoinShowHttpController

**Endpoint**: `GET /coins/:coinId`
**Responsabilidade**: Receber requisição HTTP para buscar dados de uma moeda específica.

**Fluxo**:
1. Valida coinId usando `CoinIdSchema`
2. Executa `CoinShowUseCase`
3. Retorna resposta HTTP 200 (OK) com dados da moeda

### CoinListHttpController

**Endpoint**: `GET /coins`
**Responsabilidade**: Receber requisição HTTP para listar todas as moedas.

**Fluxo**:
1. Executa `CoinListUseCase`
2. Retorna resposta HTTP 200 (OK) com lista de moedas

## Repositórios

### CoinRepository

Estende `BaseRepository` e implementa operações específicas para coins:

- **findOne**: Buscar moeda por critérios
- **find**: Buscar múltiplas moedas por critérios
- **upsert**: Atualizar moeda se existir, criar se não existir

## Adaptadores

### marketDataToCoin

Função responsável por converter dados da API do CoinGecko para o formato interno da aplicação:

```typescript
import { marketDataToCoin } from '@/shared/providers/adapter/market-data-to-coin';

export function marketDataToCoin(marketData: CoinMarketData): Omit<Coin, keyof BaseModel>
```

**Mapeamentos**:
- `marketData.id` → `coinId` (convertido para CoinsNameEnum)
- `marketData.name` → `name`
- `marketData.market_cap` → `marketCap`
- `marketData.price_change_percentage_24h` → `priceChangePercentage24h`
- `marketData.price_change_percentage_7d_in_currency` → `priceChangePercentage7d`
- `marketData.atl` → `lowestPrice`
- `marketData.ath` → `highestPrice`
- `marketData.current_price` → `currentPrice`

## Factories

Factories responsáveis pela injeção de dependência:

- **makeCoinShowController()**: Cria instância de `CoinShowHttpController`
- **makeCoinListController()**: Cria instância de `CoinListHttpController`

## Entrypoints

### coinsRouter

Router Express que define todas as rotas do módulo de coins:

- `GET /coins/:coinId` - Buscar dados de uma moeda específica
- `GET /coins` - Listar todas as moedas

## Integração com CoinGecko

O módulo integra com a API do CoinGecko através do provedor `MarketDataCoingecko`, que implementa a interface `MarketDataInterface`:

```typescript
import { MarketDataCoingecko } from '@/shared/providers/coingecko/market-data-coingecko';
import { MarketDataInterface } from '@/shared/providers/interfaces/market-data';
```

### MarketDataCoingecko.get(coinId, currency)

**Responsabilidade**: Buscar dados atualizados de uma moeda na API do CoinGecko.

**Parâmetros**:
- `coinId`: ID da moeda (deve ser um valor válido do CoinsNameEnum)
- `currency`: Moeda de referência (padrão: 'usd')

**Retorno**: `Coin | null`

**Configuração**:
- Base URL: Configurada via `COINGECKO_BASE_URL`
- API Key: Configurada via `COINGECKO_API_KEY`
- Headers de autenticação variam conforme ambiente (development/production)

## Validações

O módulo utiliza Zod para validação de dados:

- **coinId**: Deve ser um valor válido do enum CoinsNameEnum
- **Dados da API**: Validação automática dos dados retornados pela API do CoinGecko

## Tratamento de Erros

O módulo utiliza erros customizados:

- **NotFoundError**: Moeda não encontrada (nem na API nem no cache)
- **ServerError**: Erro interno do servidor (ex: falha no upsert)

## Cache e Persistência

O módulo implementa uma estratégia de cache inteligente para lidar com rate limits e indisponibilidade da API do CoinGecko:

1. **Busca Primária**: Tenta buscar dados atualizados da API do CoinGecko
2. **Tratamento de Rate Limit**: Se a API retornar erro (incluindo rate limit excedido), o sistema automaticamente busca dados em cache
3. **Cache Secundário**: Se a API falhar, busca dados em cache no MongoDB
4. **Upsert Inteligente**: Sempre atualiza o cache quando novos dados são obtidos da API
5. **Fallback Robusto**: Se não encontrar dados nem na API nem no cache, retorna erro apropriado
6. **Disponibilidade Garantida**: O sistema continua funcionando mesmo com problemas na API externa

**Benefícios desta estratégia**:
- **Alta Disponibilidade**: Sistema sempre responde, mesmo com problemas na API externa
- **Performance Otimizada**: Dados em cache respondem rapidamente
- **Resistência a Rate Limits**: Não fica bloqueado por limitações da API
- **Dados Sempre Atualizados**: Quando possível, mantém dados frescos da API

## Dependências Externas

- **mongoose**: Para operações no MongoDB
- **zod**: Para validação de dados
- **express**: Para rotas HTTP
- **CoinGecko API**: Para dados atualizados de criptomoedas

## Variáveis de Ambiente

O módulo requer as seguintes variáveis de ambiente:

- `COINGECKO_BASE_URL`: URL base da API do CoinGecko
- `COINGECKO_API_KEY`: Chave de API do CoinGecko
- `NODE_ENV`: Ambiente de execução (development/production)

## Criptomoedas Suportadas

O sistema suporta as seguintes criptomoedas:

- Bitcoin (bitcoin)
- Ethereum (ethereum)
- Solana (solana)
- Binance Coin (binancecoin)
- Tether (tether)
- Dogecoin (dogecoin)
- Litecoin (litecoin)