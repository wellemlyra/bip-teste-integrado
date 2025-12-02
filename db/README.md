# 🗄️ Banco de Dados - Scripts SQL

Esta pasta contém os scripts SQL necessários para criar e popular o banco de dados do sistema de benefícios.

## 📋 Arquivos

- **`schema.sql`** - Script de criação da estrutura do banco de dados (tabelas, constraints, etc.)
- **`seed.sql`** - Script de inserção de dados iniciais (dados de exemplo)

## 🎯 Estrutura da Tabela BENEFICIO

```sql
CREATE TABLE BENEFICIO (
  ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  NOME VARCHAR(100) NOT NULL,
  DESCRICAO VARCHAR(255),
  VALOR DECIMAL(15,2) NOT NULL,
  ATIVO BOOLEAN DEFAULT TRUE,
  VERSION BIGINT DEFAULT 0
);
```

### Campos:
- **ID**: Chave primária auto-incrementada
- **NOME**: Nome do benefício (obrigatório, máximo 100 caracteres)
- **DESCRICAO**: Descrição opcional (máximo 255 caracteres)
- **VALOR**: Valor monetário do benefício (obrigatório, 15 dígitos, 2 decimais)
- **ATIVO**: Status do benefício (padrão: TRUE)
- **VERSION**: Campo para controle de versão (optimistic locking)

## 🚀 Como Executar os Scripts

### Opção 1: PostgreSQL (Recomendado para Produção)

1. **Instale o PostgreSQL** (se ainda não tiver):
   - Windows: https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql` ou `sudo yum install postgresql`
   - macOS: `brew install postgresql`

2. **Crie o banco de dados**:
   ```bash
   # Conecte-se ao PostgreSQL
   psql -U postgres
   
   # Crie o banco de dados
   CREATE DATABASE beneficio_db;
   
   # Conecte-se ao banco criado
   \c beneficio_db
   ```

3. **Execute os scripts**:
   ```bash
   # Execute o schema
   psql -U postgres -d beneficio_db -f schema.sql
   
   # Execute o seed
   psql -U postgres -d beneficio_db -f seed.sql
   ```

   Ou dentro do psql:
   ```sql
   \i schema.sql
   \i seed.sql
   ```

### Opção 2: MySQL/MariaDB

1. **Instale o MySQL** (se ainda não tiver):
   - Windows: https://dev.mysql.com/downloads/installer/
   - Linux: `sudo apt-get install mysql-server` ou `sudo yum install mysql-server`
   - macOS: `brew install mysql`

2. **Crie o banco de dados**:
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE beneficio_db;
   USE beneficio_db;
   ```

3. **Execute os scripts**:
   ```bash
   mysql -u root -p beneficio_db < schema.sql
   mysql -u root -p beneficio_db < seed.sql
   ```

   **Nota**: Pode ser necessário ajustar a sintaxe do `GENERATED ALWAYS AS IDENTITY` para `AUTO_INCREMENT` no MySQL:
   ```sql
   ID BIGINT AUTO_INCREMENT PRIMARY KEY
   ```

### Opção 3: H2 Database (Desenvolvimento - Já Configurado)

O backend Spring Boot já está configurado para usar **H2 em memória** e executa automaticamente os scripts quando a aplicação inicia.

Os scripts estão em:
- `backend-module/src/main/resources/schema.sql`
- `backend-module/src/main/resources/data.sql`

**Não é necessário executar manualmente** - o Spring Boot faz isso automaticamente!

## 📊 Dados Iniciais (Seed)

O script `seed.sql` insere dois benefícios de exemplo:

```sql
INSERT INTO BENEFICIO (NOME, DESCRICAO, VALOR, ATIVO) VALUES
('Beneficio A', 'Descrição A', 1000.00, TRUE),
('Beneficio B', 'Descrição B', 500.00, TRUE);
```

## 🔧 Configuração do Backend para Banco Persistente

### PostgreSQL

Para usar PostgreSQL ao invés de H2, edite `backend-module/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/beneficio_db
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: sua_senha
  jpa:
    hibernate:
      ddl-auto: none  # Mantenha como 'none' pois usamos schema.sql
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

E adicione a dependência no `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### MySQL

Para usar MySQL, edite `backend-module/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/beneficio_db?useSSL=false&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: sua_senha
  jpa:
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

E adicione a dependência no `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## ✅ Verificação

Após executar os scripts, você pode verificar se tudo está correto:

```sql
-- Listar todas as tabelas
\dt  -- PostgreSQL
SHOW TABLES;  -- MySQL

-- Verificar estrutura da tabela
\d BENEFICIO  -- PostgreSQL
DESCRIBE BENEFICIO;  -- MySQL

-- Verificar dados inseridos
SELECT * FROM BENEFICIO;
```

## 📝 Notas Importantes

1. **H2 em Memória**: Os dados são perdidos quando a aplicação é reiniciada
2. **Banco Persistente**: Para produção, use PostgreSQL ou MySQL
3. **Version Field**: O campo `VERSION` é usado para optimistic locking no EJB
4. **Compatibilidade**: Os scripts foram testados com PostgreSQL. Para MySQL, pode ser necessário ajustar a sintaxe de auto-incremento

## 🐛 Troubleshooting

### Erro: "relation already exists"
- A tabela já existe. Execute `DROP TABLE BENEFICIO CASCADE;` antes de executar o schema novamente.

### Erro: "syntax error at or near"
- Verifique se está usando o banco de dados correto (PostgreSQL vs MySQL)
- Alguns comandos podem precisar de ajustes de sintaxe

### Erro de conexão
- Verifique se o banco de dados está rodando
- Verifique usuário e senha
- Verifique se o banco de dados foi criado

---

**Última atualização**: Dezembro 2024

