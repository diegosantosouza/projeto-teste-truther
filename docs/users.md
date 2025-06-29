# Módulo de Usuários

## Visão Geral

O módulo de usuários implementa um sistema completo de gerenciamento de usuários. O módulo é responsável por todas as operações CRUD (Create, Read, Update, Delete) de usuários.

## Estrutura do Módulo

```
src/modules/user/
├── controllers/          # Controladores HTTP
├── dto/                  # Data Transfer Objects
├── entities/             # Entidades de domínio
├── entrypoints/          # Pontos de entrada da aplicação
├── factories/            # Factories para injeção de dependência
├── repositories/         # Repositórios de dados
├── schemas/              # Schemas do MongoDB
├── services/             # Serviços de domínio
├── usecases/             # Casos de uso
└── index.ts              # Arquivo de exportação principal
```

## Entidades

### User

A entidade principal do módulo representa um usuário no sistema.

```typescript
export type User = BaseModel & {
  name: string;
  email: string;
  password: string;
  roles: Array<UserRole>;
};
```

### UserRole

Enum que define os tipos de usuário disponíveis no sistema.

```typescript
export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}
```

## Schemas (MongoDB)

### UserSchema

Schema do MongoDB para a coleção de usuários com as seguintes características:

- **name**: String obrigatória com índice
- **email**: String obrigatória com índice único
- **password**: String obrigatória (hash da senha)
- **roles**: Array de strings com valores padrão `[UserRole.CLIENT]`
- **timestamps**: Automático (createdAt, updatedAt)
- **virtual id**: Campo virtual que retorna o _id como string

## DTOs (Data Transfer Objects)

### UserCreateInput
```typescript
{
  name: string;        // Mínimo 3 caracteres
  email: string;       // Formato de email válido
  password: string;    // Mínimo 6 caracteres
  roles: UserRole[];   // Array de roles válidos
}
```

### UserUpdateInput
```typescript
{
  name?: string;       // Opcional, mínimo 3 caracteres
  email?: string;      // Opcional, formato de email válido
  password?: string;   // Opcional, mínimo 6 caracteres
  roles?: UserRole[];  // Opcional, array de roles válidos
}
```

### UserShowInput
```typescript
{
  id: string;          // ObjectId válido (24 caracteres hex)
}
```

### UserDeleteInput
```typescript
{
  id: string;          // ObjectId válido (24 caracteres hex)
}
```

### UserListInput
```typescript
{
  name?: string;       // Opcional, mínimo 3 caracteres
  email?: string;      // Opcional, formato de email válido
  roles?: UserRole;    // Opcional, role específico
}
```

## Casos de Uso (Use Cases)

### UserCreateUseCase

**Responsabilidade**: Criar um novo usuário no sistema.

**Fluxo**:
1. Verifica se já existe um usuário com o email fornecido
2. Se existir, lança `EmailInUseError`
3. Hash da senha usando `PasswordService`
4. Cria o usuário no repositório
5. Retorna o usuário sem a senha

**Dependências**:
- `UserRepository`
- `PasswordService`
- `EmailInUseError`

### UserShowUseCase

**Responsabilidade**: Buscar um usuário específico por ID.

**Fluxo**:
1. Busca o usuário pelo ID no repositório
2. Se não encontrar, lança `NotFoundError`
3. Retorna o usuário sem a senha

**Dependências**:
- `UserRepository`
- `NotFoundError`

### UserUpdateUseCase

**Responsabilidade**: Atualizar dados de um usuário existente.

**Fluxo**:
1. Verifica se o usuário existe pelo ID
2. Se não existir, lança `NotFoundError`
3. Se uma nova senha for fornecida, faz o hash
4. Atualiza o usuário no repositório
5. Se falhar, lança `ServerError`
6. Retorna o usuário atualizado sem a senha

**Dependências**:
- `UserRepository`
- `PasswordService`
- `NotFoundError`
- `ServerError`

### UserDeleteUseCase

**Responsabilidade**: Excluir um usuário do sistema.

**Fluxo**:
1. Verifica se o usuário existe pelo ID
2. Se não existir, lança `NotFoundError`
3. Exclui o usuário do repositório
4. Se falhar, lança `ServerError`
5. Retorna `true` em caso de sucesso

**Dependências**:
- `UserRepository`
- `NotFoundError`
- `ServerError`

### UserListUseCase

**Responsabilidade**: Listar usuários com filtros opcionais.

**Fluxo**:
1. Constrói critérios de busca baseado nos filtros fornecidos
2. Aplica busca case-insensitive para nome e email
3. Filtra por roles se especificado
4. Retorna lista de usuários sem senhas

**Dependências**:
- `UserRepository`

## Controladores HTTP

### UserCreateHttpController

**Endpoint**: `POST /users`
**Responsabilidade**: Receber requisição HTTP para criação de usuário.

**Fluxo**:
1. Valida dados de entrada usando `UserCreateInputSchema`
2. Executa `UserCreateUseCase`
3. Retorna resposta HTTP 201 (Created) com dados do usuário

### UserShowHttpController

**Endpoint**: `GET /users/:id`
**Responsabilidade**: Receber requisição HTTP para buscar usuário.

**Fluxo**:
1. Valida ID usando `UserIdSchema`
2. Executa `UserShowUseCase`
3. Retorna resposta HTTP 200 (OK) com dados do usuário

### UserUpdateHttpController

**Endpoint**: `PATCH /users/:id`
**Responsabilidade**: Receber requisição HTTP para atualizar usuário.

**Fluxo**:
1. Valida ID usando `UserIdSchema`
2. Valida dados de entrada usando `UserUpdateInputSchema`
3. Executa `UserUpdateUseCase`
4. Retorna resposta HTTP 200 (OK) com dados atualizados

### UserDeleteHttpController

**Endpoint**: `DELETE /users/:id`
**Responsabilidade**: Receber requisição HTTP para excluir usuário.

**Fluxo**:
1. Valida ID usando `UserIdSchema`
2. Executa `UserDeleteUseCase`
3. Retorna resposta HTTP 204 (No Content)

### UserListHttpController

**Endpoint**: `GET /users`
**Responsabilidade**: Receber requisição HTTP para listar usuários.

**Fluxo**:
1. Valida parâmetros de query usando `UserListInputSchema`
2. Executa `UserListUseCase`
3. Retorna resposta HTTP 200 (OK) com lista de usuários

## Repositórios

### UserRepository

Estende `BaseRepository` e implementa operações específicas para usuários:

- **create**: Criar novo usuário
- **findById**: Buscar usuário por ID
- **findOne**: Buscar usuário por critérios
- **find**: Buscar múltiplos usuários por critérios
- **update**: Atualizar usuário
- **delete**: Excluir usuário

## Serviços

### PasswordService

Serviço para gerenciamento de senhas usando bcrypt:

- **hash(password: string)**: Gera hash da senha com salt rounds = 10
- **compare(plain: string, hash: string)**: Compara senha em texto plano com hash

## Factories

Factories responsáveis pela injeção de dependência:

- **makeUserCreateController()**: Cria instância de `UserCreateHttpController`
- **makeUserShowController()**: Cria instância de `UserShowHttpController`
- **makeUserUpdateController()**: Cria instância de `UserUpdateHttpController`
- **makeUserDeleteController()**: Cria instância de `UserDeleteHttpController`
- **makeUserListController()**: Cria instância de `UserListHttpController`

## Entrypoints

### userRouter

Router Express que define todas as rotas do módulo de usuários:

- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `GET /users/:id` - Buscar usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

## Validações

O módulo utiliza Zod para validação de dados:

- **Email**: Formato de email válido
- **Senha**: Mínimo 6 caracteres
- **Nome**: Mínimo 3 caracteres
- **ID**: ObjectId válido (24 caracteres hex)
- **Roles**: Valores do enum UserRole

## Tratamento de Erros

O módulo utiliza erros customizados:

- **EmailInUseError**: Email já está em uso
- **NotFoundError**: Usuário não encontrado
- **ServerError**: Erro interno do servidor

## Segurança

- Senhas são hasheadas usando bcrypt com salt rounds = 10
- Senhas nunca são retornadas nas respostas HTTP
- Validação rigorosa de entrada usando Zod
- Índices únicos no banco de dados para email

## Dependências Externas

- **bcrypt**: Para hash de senhas
- **mongoose**: Para operações no MongoDB
- **zod**: Para validação de dados
- **express**: Para rotas HTTP