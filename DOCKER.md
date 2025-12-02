# 🐳 Docker Compose - Sistema de Gestão de Benefícios

Este guia explica como executar todo o sistema usando Docker Compose.

## 📋 Pré-requisitos

- **Docker** instalado (versão 20.10+)
- **Docker Compose** instalado (versão 2.0+)

### Verificar instalação:
```bash
docker --version
docker-compose --version
```

## 🚀 Como Executar

### 1. Subir todos os serviços

Na raiz do projeto, execute:

```bash
docker-compose up -d --build
```

Este comando irá:
- ✅ Construir as imagens do backend e frontend
- ✅ Subir o backend Spring Boot (porta 8080)
- ✅ Subir o frontend Angular (porta 4200)
- ✅ Executar automaticamente os scripts `schema.sql` e `seed.sql` no H2
- ✅ Popular o banco com dados iniciais

### 2. Verificar se está tudo funcionando

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs apenas do backend
docker-compose logs -f backend

# Ver logs apenas do frontend
docker-compose logs -f frontend

# Ver status dos containers
docker-compose ps
```

### 3. Acessar o Sistema

#### 🌐 Frontend (Interface Web)
**URL:** http://localhost:4200

Aqui você pode:
- Ver a lista de benefícios
- Criar novos benefícios
- Editar benefícios existentes
- Realizar transferências entre benefícios
- Desativar benefícios

#### 🔧 Backend API
**URL:** http://localhost:8080

**Endpoints disponíveis:**
- `GET http://localhost:8080/api/v1/beneficios` - Listar todos
- `GET http://localhost:8080/api/v1/beneficios/{id}` - Buscar por ID
- `POST http://localhost:8080/api/v1/beneficios` - Criar novo
- `PUT http://localhost:8080/api/v1/beneficios/{id}` - Atualizar
- `DELETE http://localhost:8080/api/v1/beneficios/{id}` - Deletar (lógico)
- `POST http://localhost:8080/api/v1/beneficios/transfer` - Transferir

#### 📚 Swagger/OpenAPI (Documentação da API)
**URL:** http://localhost:8080/swagger-ui.html

Aqui você pode:
- Ver todos os endpoints disponíveis
- Testar a API diretamente
- Ver exemplos de requisições/respostas

#### 🗄️ H2 Console (Banco de Dados)
**URL:** http://localhost:8080/h2-console

**Credenciais:**
- JDBC URL: `jdbc:h2:mem:beneficio-db`
- Username: `sa`
- Password: (deixe em branco)

Aqui você pode:
- Ver as tabelas criadas
- Executar queries SQL
- Verificar os dados inseridos

## 📊 Verificar Dados Iniciais

Após subir os containers, você pode verificar se os dados foram inseridos:

### Via API:
```bash
curl http://localhost:8080/api/v1/beneficios
```

### Via H2 Console:
1. Acesse http://localhost:8080/h2-console
2. Conecte com as credenciais acima
3. Execute: `SELECT * FROM BENEFICIO;`

Você deve ver 2 registros:
- Beneficio A - R$ 1.000,00
- Beneficio B - R$ 500,00

## 🛠️ Comandos Úteis

### Parar todos os serviços
```bash
docker-compose down
```

### Parar e remover volumes (limpar dados)
```bash
docker-compose down -v
```

### Reconstruir e reiniciar
```bash
docker-compose up -d --build --force-recreate
```

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Entrar no container do backend
```bash
docker-compose exec backend sh
```

### Entrar no container do frontend
```bash
docker-compose exec frontend sh
```

### Reiniciar um serviço específico
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 🔍 Troubleshooting

### Backend não inicia
```bash
# Ver logs detalhados
docker-compose logs backend

# Verificar se a porta 8080 está livre
netstat -an | grep 8080  # Linux/Mac
netstat -an | findstr 8080  # Windows
```

### Frontend não carrega
```bash
# Ver logs do frontend
docker-compose logs frontend

# Verificar se o backend está respondendo
curl http://localhost:8080/api/v1/beneficios
```

### Erro de build
```bash
# Limpar cache e reconstruir
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Porta já em uso
Se as portas 8080 ou 4200 estiverem em uso, você pode alterar no `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"  # Backend na porta 8081
  - "4201:80"    # Frontend na porta 4201
```

## 📝 Estrutura dos Containers

```
┌─────────────────────────────────────┐
│  Frontend (Nginx)                    │
│  Porta: 4200                         │
│  URL: http://localhost:4200          │
└──────────────┬───────────────────────┘
               │ HTTP
               ▼
┌─────────────────────────────────────┐
│  Backend (Spring Boot)               │
│  Porta: 8080                         │
│  URL: http://localhost:8080         │
└──────────────┬───────────────────────┘
               │ JDBC
               ▼
┌─────────────────────────────────────┐
│  H2 Database (em memória)            │
│  Gerido pelo Spring Boot             │
│  Scripts executados automaticamente  │
└─────────────────────────────────────┘
```

## ✅ Checklist de Verificação

Após executar `docker-compose up -d --build`, verifique:

- [ ] Backend está rodando: `curl http://localhost:8080/api/v1/beneficios`
- [ ] Frontend está acessível: http://localhost:4200
- [ ] Swagger está funcionando: http://localhost:8080/swagger-ui.html
- [ ] H2 Console está acessível: http://localhost:8080/h2-console
- [ ] Dados iniciais foram inseridos (2 benefícios)

## 🎯 Próximos Passos

1. Acesse http://localhost:4200
2. Explore a interface
3. Crie novos benefícios
4. Teste transferências
5. Consulte a documentação da API no Swagger

---

**Desenvolvido para o Desafio Fullstack Integrado**

