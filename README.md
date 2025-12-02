# 🏗️ Sistema de Gestão de Benefícios - Desafio Fullstack Integrado

Sistema completo para gerenciamento de benefícios com funcionalidades de CRUD e transferências entre benefícios, desenvolvido com arquitetura em camadas (DB, EJB, Backend Spring Boot e Frontend Angular).

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Validações Implementadas](#-validações-implementadas)
- [Endpoints da API](#-endpoints-da-api)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

Este projeto é uma solução completa para gerenciamento de benefícios que permite:

- ✅ **CRUD completo** de benefícios (criar, ler, atualizar, deletar)
- ✅ **Transferências** de saldo entre benefícios com validações robustas
- ✅ **Interface web moderna** com Angular 17 e Material Design
- ✅ **API REST** documentada com Swagger/OpenAPI
- ✅ **Arquitetura em camadas** bem definida
- ✅ **Testes automatizados** para garantir qualidade
- ✅ **Docker Compose** para execução simplificada

### 🎨 Demonstração Visual

- **Frontend:** Interface moderna e responsiva em http://localhost:4200
- **Swagger:** Documentação interativa da API em http://localhost:8080/swagger-ui.html
- **H2 Console:** Acesso ao banco de dados em http://localhost:8080/h2-console

---

## ✨ Funcionalidades

### Backend (Spring Boot)

- **CRUD de Benefícios**
  - Criar novos benefícios
  - Listar todos os benefícios
  - Buscar benefício por ID
  - Atualizar benefícios existentes
  - Deletar benefícios (deleção lógica)

- **Transferências**
  - Transferir saldo entre benefícios
  - Validações de negócio completas
  - Controle de concorrência com locking
  - Rollback automático em caso de erro

- **Validações**
  - Validação de dados de entrada
  - Validação de regras de negócio
  - Tratamento de erros padronizado
  - Mensagens de erro claras

### Frontend (Angular 17)

- **Listagem de Benefícios**
  - Tabela responsiva com Material Design
  - Formatação de valores monetários
  - Indicadores visuais de status
  - Ações rápidas (editar, deletar)

- **Formulários**
  - Criação de novos benefícios
  - Edição de benefícios existentes
  - Validação em tempo real
  - Feedback visual de erros

- **Transferências**
  - Diálogo modal para transferências
  - Seleção de origem e destino
  - Validação de saldo suficiente
  - Resumo antes de confirmar

---

## 🏛️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────────┐
│         Frontend (Angular 17)          │
│     Componentes + Services + Models     │
└──────────────┬──────────────────────────┘
               │ HTTP REST
┌──────────────▼──────────────────────────┐
│      Backend (Spring Boot)              │
│  Controller → Service → Repository      │
└──────────────┬──────────────────────────┘
               │ JPA
┌──────────────▼──────────────────────────┐
│      EJB Module (Regras de Negócio)     │
│     BeneficioEjbService (Corrigido)     │
└──────────────┬──────────────────────────┘
               │ JDBC
┌──────────────▼──────────────────────────┐
│      Database (H2 / PostgreSQL)         │
│         Tabela BENEFICIO                │
└─────────────────────────────────────────┘
```

### Camadas do Backend

1. **Controller** (`BeneficioController`)
   - Recebe requisições HTTP
   - Valida entrada com Bean Validation
   - Retorna respostas HTTP

2. **Service** (`BeneficioService` / `BeneficioServiceImpl`)
   - Contém regras de negócio
   - Orquestra operações
   - Trata exceções de negócio

3. **Repository** (`BeneficioRepository`)
   - Acesso aos dados
   - Operações JPA
   - Queries customizadas (se necessário)

4. **Domain** (`Beneficio`)
   - Entidade JPA
   - Mapeamento para tabela
   - Validações de domínio

---

## 🛠️ Tecnologias

### Backend
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Data JPA**
- **H2 Database** (em memória)
- **Springdoc OpenAPI** (Swagger)
- **Lombok**
- **Maven**

### Frontend
- **Angular 17**
- **Angular Material 17**
- **TypeScript 5.4**
- **RxJS 7.8**
- **SCSS**

### Infraestrutura
- **Docker**
- **Docker Compose**
- **Nginx** (para servir frontend)

### EJB Module
- **Jakarta EE**
- **JPA** com locking pessimista
- **Optimistic Locking** (@Version)

---

## ✅ Validações Implementadas

### Validações de Entrada (Bean Validation)

#### BeneficioRequest (Criar/Atualizar Benefício)

| Campo | Validação | Mensagem de Erro |
|-------|-----------|-------------------|
| `nome` | `@NotBlank` | Campo obrigatório |
| `nome` | `@Size(max = 100)` | Máximo 100 caracteres |
| `descricao` | `@Size(max = 255)` | Máximo 255 caracteres |
| `valor` | `@NotNull` | Campo obrigatório |
| `valor` | `@DecimalMin(value = "0.0")` | Valor deve ser >= 0 |

#### TransferRequest (Transferência)

| Campo | Validação | Mensagem de Erro |
|-------|-----------|-------------------|
| `fromId` | `@NotNull` | Campo obrigatório |
| `toId` | `@NotNull` | Campo obrigatório |
| `amount` | `@NotNull` | Campo obrigatório |
| `amount` | `@DecimalMin(value = "0.01")` | Valor deve ser >= 0.01 |

### Validações de Negócio

#### Transferência (`BeneficioServiceImpl.transfer()`)

1. ✅ **Origem ≠ Destino**
   - Validação: `fromId != toId`
   - Erro: `"Origem e destino não podem ser o mesmo benefício"`

2. ✅ **Valor > 0**
   - Validação: `amount > 0`
   - Erro: `"Valor da transferência deve ser maior que zero"`

3. ✅ **Benefícios Existem**
   - Validação: Ambos os benefícios devem existir
   - Erro: `"Benefício de origem/destino não encontrado"`

4. ✅ **Benefícios Ativos**
   - Validação: Ambos devem estar ativos (`ativo = true`)
   - Erro: `"Benefícios inativos não podem participar de transferências"`

5. ✅ **Saldo Suficiente**
   - Validação: `from.valor >= amount`
   - Erro: `"Saldo insuficiente para transferência"`

#### EJB Service (`BeneficioEjbService.transfer()`)

Além das validações acima, o EJB implementa:

6. ✅ **Locking Pessimista**
   - Uso de `LockModeType.PESSIMISTIC_WRITE`
   - Previne lost update em cenários concorrentes

7. ✅ **Optimistic Locking**
   - Campo `@Version` na entidade
   - Detecta conflitos de concorrência

8. ✅ **Rollback Automático**
   - `@ApplicationException(rollback = true)` em `SaldoInsuficienteException`
   - Garante consistência em caso de erro

### Validações do Frontend

#### Formulário de Benefício

- **Nome:** Obrigatório, máximo 100 caracteres
- **Descrição:** Opcional, máximo 255 caracteres
- **Valor:** Obrigatório, mínimo 0
- **Ativo:** Checkbox (padrão: true)

#### Formulário de Transferência

- **Origem:** Obrigatório, deve ser diferente do destino
- **Destino:** Obrigatório, deve ser diferente da origem
- **Valor:** Obrigatório, mínimo 0.01
- **Validação de Saldo:** Verifica saldo suficiente antes de permitir transferência

---

## 🔌 Endpoints da API

Base URL: `http://localhost:8080/api/v1/beneficios`

### 1. Listar Todos os Benefícios

```http
GET /api/v1/beneficios
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Beneficio A",
    "descricao": "Descrição A",
    "valor": 1000.00,
    "ativo": true
  },
  {
    "id": 2,
    "nome": "Beneficio B",
    "descricao": "Descrição B",
    "valor": 500.00,
    "ativo": true
  }
]
```

**Exemplo com cURL:**
```bash
curl http://localhost:8080/api/v1/beneficios
```

---

### 2. Buscar Benefício por ID

```http
GET /api/v1/beneficios/{id}
```

**Parâmetros:**
- `id` (path) - ID do benefício

**Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "Beneficio A",
  "descricao": "Descrição A",
  "valor": 1000.00,
  "ativo": true
}
```

**Resposta (404 Not Found):**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Benefício não encontrado: 999"
}
```

**Exemplo com cURL:**
```bash
curl http://localhost:8080/api/v1/beneficios/1
```

---

### 3. Criar Novo Benefício

```http
POST /api/v1/beneficios
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nome": "Vale Alimentação",
  "descricao": "Benefício para alimentação",
  "valor": 800.00,
  "ativo": true
}
```

**Resposta (201 Created):**
```json
{
  "id": 3,
  "nome": "Vale Alimentação",
  "descricao": "Benefício para alimentação",
  "valor": 800.00,
  "ativo": true
}
```

**Resposta (400 Bad Request) - Validação:**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "errors": {
    "nome": "Este campo é obrigatório",
    "valor": "O valor deve ser maior ou igual a zero"
  }
}
```

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/beneficios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Vale Alimentação",
    "descricao": "Benefício para alimentação",
    "valor": 800.00,
    "ativo": true
  }'
```

---

### 4. Atualizar Benefício

```http
PUT /api/v1/beneficios/{id}
Content-Type: application/json
```

**Parâmetros:**
- `id` (path) - ID do benefício a ser atualizado

**Body (JSON):**
```json
{
  "nome": "Vale Alimentação Atualizado",
  "descricao": "Nova descrição",
  "valor": 900.00,
  "ativo": true
}
```

**Resposta (200 OK):**
```json
{
  "id": 3,
  "nome": "Vale Alimentação Atualizado",
  "descricao": "Nova descrição",
  "valor": 900.00,
  "ativo": true
}
```

**Resposta (404 Not Found):**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Benefício não encontrado: 999"
}
```

**Exemplo com cURL:**
```bash
curl -X PUT http://localhost:8080/api/v1/beneficios/3 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Vale Alimentação Atualizado",
    "descricao": "Nova descrição",
    "valor": 900.00,
    "ativo": true
  }'
```

---

### 5. Deletar Benefício (Deleção Lógica)

```http
DELETE /api/v1/beneficios/{id}
```

**Parâmetros:**
- `id` (path) - ID do benefício a ser deletado

**Resposta (204 No Content):**
```
(sem corpo)
```

**Nota:** A deleção é lógica - o benefício é marcado como `ativo = false`, mas não é removido do banco de dados.

**Exemplo com cURL:**
```bash
curl -X DELETE http://localhost:8080/api/v1/beneficios/3
```

---

### 6. Transferir Saldo entre Benefícios

```http
POST /api/v1/beneficios/transfer
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fromId": 1,
  "toId": 2,
  "amount": 100.00
}
```

**Resposta (204 No Content):**
```
(sem corpo)
```

**Resposta (422 Unprocessable Entity) - Saldo Insuficiente:**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Saldo insuficiente para transferência"
}
```

**Resposta (422 Unprocessable Entity) - Origem = Destino:**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Origem e destino não podem ser o mesmo benefício"
}
```

**Resposta (422 Unprocessable Entity) - Benefício Inativo:**
```json
{
  "timestamp": "2024-12-02T10:00:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Benefícios inativos não podem participar de transferências"
}
```

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/beneficios/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromId": 1,
    "toId": 2,
    "amount": 100.00
  }'
```

---

## 🚀 Como Executar

### Opção 1: Docker Compose (Recomendado)

A forma mais simples de executar todo o sistema:

```bash
# Na raiz do projeto
docker-compose up -d --build
```

**Aguarde 2-3 minutos** para:
- Compilar o backend (Maven)
- Compilar o frontend (Angular)
- Criar o banco de dados H2
- Executar scripts SQL automaticamente
- Inserir dados iniciais

**Acessar:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

**Parar o sistema:**
```bash
docker-compose down
```

**Ver logs:**
```bash
docker-compose logs -f
```

---

### Opção 2: Execução Local (Backend + Frontend Separados)

#### Pré-requisitos

- **Java 17+**
- **Maven 3.9+**
- **Node.js 18+**
- **npm 9+**

#### Passo 1: Executar Backend

```bash
# Entrar na pasta do backend
cd backend-module

# Compilar e executar
mvn clean package
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

**Verificar:**
```bash
curl http://localhost:8080/api/v1/beneficios
```

#### Passo 2: Executar Frontend

Em outro terminal:

```bash
# Entrar na pasta do frontend
cd frontend/app

# Instalar dependências (apenas na primeira vez)
npm install

# Executar
npm start
```

O frontend estará disponível em: `http://localhost:4200`

---

### Opção 3: Apenas Backend (para testes da API)

```bash
cd backend-module
mvn spring-boot:run
```

Teste a API:
```bash
# Listar benefícios
curl http://localhost:8080/api/v1/beneficios

# Criar benefício
curl -X POST http://localhost:8080/api/v1/beneficios \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste", "valor": 100.00}'

# Transferir
curl -X POST http://localhost:8080/api/v1/beneficios/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromId": 1, "toId": 2, "amount": 50.00}'
```

---

## 📁 Estrutura do Projeto

```
bip-teste-integrado-main/
├── db/                          # Scripts SQL
│   ├── schema.sql               # Criação da tabela
│   ├── seed.sql                 # Dados iniciais
│   └── README.md                # Documentação do banco
│
├── ejb-module/                  # Módulo EJB (regras de negócio)
│   └── src/main/java/com/example/ejb/
│       ├── BeneficioEjbService.java    # Serviço EJB corrigido
│       ├── Beneficio.java              # Entidade EJB
│       └── SaldoInsuficienteException.java
│
├── backend-module/              # Backend Spring Boot
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/         # Controllers REST
│   │   │   └── BeneficioController.java
│   │   ├── service/            # Serviços de negócio
│   │   │   ├── BeneficioService.java
│   │   │   └── impl/BeneficioServiceImpl.java
│   │   ├── repository/         # Repositórios JPA
│   │   │   └── BeneficioRepository.java
│   │   ├── domain/             # Entidades JPA
│   │   │   └── Beneficio.java
│   │   ├── dto/                # DTOs
│   │   │   ├── BeneficioRequest.java
│   │   │   ├── BeneficioResponse.java
│   │   │   └── TransferRequest.java
│   │   ├── exception/          # Exceções customizadas
│   │   │   ├── BusinessException.java
│   │   │   └── ResourceNotFoundException.java
│   │   └── config/             # Configurações
│   │       ├── CorsConfig.java
│   │       └── GlobalExceptionHandler.java
│   ├── src/test/java/          # Testes
│   │   └── com/example/backend/
│   │       ├── controller/BeneficioControllerTest.java
│   │       └── service/BeneficioServiceTest.java
│   └── src/main/resources/
│       ├── application.yml      # Configuração Spring Boot
│       ├── schema.sql          # Script de criação
│       └── data.sql            # Script de dados iniciais
│
├── frontend/                    # Frontend Angular
│   ├── app/
│   │   ├── src/app/
│   │   │   ├── components/     # Componentes Angular
│   │   │   │   ├── beneficio-list/
│   │   │   │   ├── beneficio-form/
│   │   │   │   └── transfer-dialog/
│   │   │   ├── services/        # Serviços HTTP
│   │   │   │   └── beneficio.service.ts
│   │   │   ├── models/          # Interfaces TypeScript
│   │   │   │   └── beneficio.model.ts
│   │   │   └── app.component.*
│   │   └── src/environments/   # Configurações de ambiente
│   └── README.md               # Documentação do frontend
│
├── docs/                        # Documentação adicional
│   └── README.md
│
├── docker-compose.yml           # Configuração Docker Compose
├── Dockerfile                   # Dockerfile do backend
├── README.md                    # Este arquivo
├── DOCKER.md                    # Guia Docker
├── COMO_USAR.md                 # Guia de uso
├── INICIO_RAPIDO.md             # Início rápido
└── GUIA_FORK_PR.md              # Guia de fork e PR
```

---

## 🧪 Testes

### Executar Testes do Backend

```bash
cd backend-module
mvn test
```

### Testes Implementados

#### BeneficioServiceTest

1. **shouldListInitialSeedData**
   - Verifica se os dados iniciais (seed) foram carregados

2. **shouldCreateAndFetchBeneficio**
   - Testa criação de novo benefício
   - Testa busca por ID

3. **shouldTransferAmountBetweenBeneficios**
   - Testa transferência bem-sucedida
   - Verifica se os saldos foram atualizados corretamente

4. **shouldNotAllowTransferWithInsufficientBalance**
   - Testa falha de transferência por saldo insuficiente
   - Verifica se a exceção é lançada corretamente

#### BeneficioControllerTest

1. **shouldListBeneficios**
   - Testa endpoint GET /api/v1/beneficios
   - Verifica resposta JSON e status HTTP

---

## 📚 Documentação

### Swagger/OpenAPI

Com o backend em execução, acesse:

- **UI Swagger:** http://localhost:8080/swagger-ui.html
- **JSON OpenAPI:** http://localhost:8080/v3/api-docs

No Swagger você pode:
- Ver todos os endpoints
- Testar a API diretamente
- Ver exemplos de requisições/respostas
- Entender a estrutura dos dados

### READMEs Adicionais

- **`DOCKER.md`** - Guia completo do Docker Compose
- **`COMO_USAR.md`** - Guia detalhado de uso do sistema
- **`INICIO_RAPIDO.md`** - Guia rápido para começar
- **`frontend/README.md`** - Documentação completa do frontend
- **`db/README.md`** - Instruções de banco de dados
- **`GUIA_FORK_PR.md`** - Como fazer fork e Pull Request

---

## 🔍 Verificação Rápida

### Verificar se está tudo funcionando:

```bash
# 1. Verificar containers (se usando Docker)
docker-compose ps

# 2. Testar backend
curl http://localhost:8080/api/v1/beneficios

# 3. Verificar frontend (abra no navegador)
# http://localhost:4200

# 4. Verificar Swagger (abra no navegador)
# http://localhost:8080/swagger-ui.html
```

### Dados Iniciais

Após iniciar o sistema, você terá 2 benefícios pré-cadastrados:

- **Beneficio A** - R$ 1.000,00
- **Beneficio B** - R$ 500,00

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar se a porta 8080 está livre
netstat -an | grep 8080  # Linux/Mac
netstat -an | findstr 8080  # Windows

# Ver logs
docker-compose logs backend  # Docker
# ou
cd backend-module && mvn spring-boot:run  # Local
```

### Frontend não carrega

```bash
# Verificar se o backend está rodando
curl http://localhost:8080/api/v1/beneficios

# Verificar configuração da API
cat frontend/app/src/environments/environment.ts
```

### Erro de CORS

O backend já está configurado para aceitar requisições de `http://localhost:4200`. Se ainda houver problemas, verifique `backend-module/src/main/java/com/example/backend/config/CorsConfig.java`.

---

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

## 👨‍💻 Desenvolvido Por

Implementação completa do **Desafio Fullstack Integrado**, demonstrando:

- ✅ Arquitetura em camadas
- ✅ Correção de bugs críticos
- ✅ CRUD completo
- ✅ Validações robustas
- ✅ Testes automatizados
- ✅ Documentação completa
- ✅ Interface moderna e responsiva

---

**🚀 Pronto para usar! Execute `docker-compose up -d --build` e acesse http://localhost:4200**
