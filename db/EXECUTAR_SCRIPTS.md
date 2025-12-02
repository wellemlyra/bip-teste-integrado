# 🚀 Guia Rápido - Executar Scripts do Banco de Dados

## ⚡ Execução Rápida

### Para Desenvolvimento (H2 - Automático)
✅ **Não precisa fazer nada!** O Spring Boot executa automaticamente os scripts quando inicia.

### Para Produção (PostgreSQL)

```bash
# 1. Criar banco de dados
createdb -U postgres beneficio_db

# 2. Executar scripts
psql -U postgres -d beneficio_db -f schema.sql
psql -U postgres -d beneficio_db -f seed.sql

# 3. Verificar
psql -U postgres -d beneficio_db -c "SELECT * FROM BENEFICIO;"
```

### Para Produção (MySQL)

```bash
# 1. Criar banco de dados
mysql -u root -p -e "CREATE DATABASE beneficio_db;"

# 2. Executar scripts
mysql -u root -p beneficio_db < schema.sql
mysql -u root -p beneficio_db < seed.sql

# 3. Verificar
mysql -u root -p beneficio_db -e "SELECT * FROM BENEFICIO;"
```

## 📋 Checklist

- [ ] Banco de dados instalado (PostgreSQL/MySQL)
- [ ] Banco de dados criado
- [ ] Script `schema.sql` executado com sucesso
- [ ] Script `seed.sql` executado com sucesso
- [ ] Dados verificados (SELECT * FROM BENEFICIO)

## 📚 Mais Informações

Para detalhes completos, consulte `db/README.md`

