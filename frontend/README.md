# 🎨 Frontend Angular 17 - Sistema de Gestão de Benefícios

Frontend moderno desenvolvido com **Angular 17** e **Angular Material** para gerenciamento completo de benefícios.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Instalação e Execução](#instalação-e-execução)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Serviços](#serviços)
- [Estilos e Temas](#estilos-e-temas)
- [Tratamento de Erros](#tratamento-de-erros)
- [Responsividade](#responsividade)

## 🎯 Visão Geral

Este frontend foi desenvolvido como parte do **Desafio Fullstack Integrado**, oferecendo uma interface moderna e intuitiva para:

- ✅ Gerenciar benefícios (CRUD completo)
- ✅ Realizar transferências entre benefícios
- ✅ Visualizar saldos e status
- ✅ Validar operações em tempo real
- ✅ Exibir feedback visual para todas as ações

## 🛠 Tecnologias Utilizadas

- **Angular 17.3** - Framework principal
- **Angular Material 17** - Componentes UI
- **TypeScript 5.4** - Linguagem de programação
- **RxJS 7.8** - Programação reativa
- **SCSS** - Pré-processador CSS
- **Angular Forms (Reactive Forms)** - Formulários reativos
- **Angular Router** - Roteamento
- **Angular HttpClient** - Comunicação HTTP

## 📁 Estrutura do Projeto

```
frontend/app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── beneficio-list/          # Lista de benefícios
│   │   │   ├── beneficio-form/          # Formulário de criação/edição
│   │   │   └── transfer-dialog/          # Diálogo de transferência
│   │   ├── models/
│   │   │   └── beneficio.model.ts       # Interfaces TypeScript
│   │   ├── services/
│   │   │   └── beneficio.service.ts     # Serviço HTTP
│   │   ├── app.component.*              # Componente raiz
│   │   ├── app.config.ts                # Configuração da aplicação
│   │   └── app.routes.ts                # Rotas
│   ├── environments/
│   │   ├── environment.ts               # Configuração dev
│   │   └── environment.prod.ts         # Configuração prod
│   ├── styles.scss                      # Estilos globais
│   └── index.html                       # HTML principal
├── angular.json                         # Configuração Angular CLI
├── package.json                         # Dependências
└── tsconfig.json                        # Configuração TypeScript
```

## ✨ Funcionalidades

### 1. Listagem de Benefícios
- Tabela responsiva com Material Design
- Exibição de ID, nome, descrição, valor e status
- Formatação de valores monetários em R$
- Indicadores visuais de status (Ativo/Inativo)
- Botões de ação (Editar, Deletar)
- Estado vazio quando não há benefícios
- Loading spinner durante carregamento

### 2. Criação e Edição de Benefícios
- Formulário modal com validação completa
- Campos:
  - **Nome** (obrigatório, máximo 100 caracteres)
  - **Descrição** (opcional, máximo 255 caracteres)
  - **Valor** (obrigatório, mínimo 0)
  - **Status Ativo** (checkbox)
- Validação em tempo real
- Mensagens de erro contextuais
- Feedback visual de sucesso/erro

### 3. Transferência entre Benefícios
- Diálogo modal para transferências
- Seleção de benefício de origem e destino
- Validação de saldo suficiente
- Exibição de saldos disponíveis
- Resumo da transferência antes de confirmar
- Validação de origem ≠ destino
- Cálculo de saldo após transferência

### 4. Deleção Lógica
- Confirmação antes de desativar
- Deleção lógica (marca como inativo)
- Atualização automática da lista

### 5. Tratamento de Erros
- Snackbars para feedback visual
- Mensagens de erro específicas da API
- Tratamento de erros de validação
- Tratamento de erros de rede

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 18+ (recomendado: Node.js 20 LTS)
- **npm** 9+ ou **yarn**
- **Angular CLI** 17+

### Instalação

1. **Navegue até a pasta do frontend:**
   ```bash
   cd frontend/app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Verifique se o backend está rodando:**
   - O backend deve estar em `http://localhost:8080`
   - Verifique a configuração em `src/environments/environment.ts`

### Execução

**Modo de desenvolvimento:**
```bash
npm start
# ou
ng serve
```

A aplicação estará disponível em: `http://localhost:4200`

**Build para produção:**
```bash
npm run build
# ou
ng build --configuration production
```

Os arquivos compilados estarão em `dist/app/`

**Executar testes:**
```bash
npm test
# ou
ng test
```

## 🏗 Arquitetura

### Padrão de Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────┐
│      Componentes (UI)              │
│  (beneficio-list, form, dialog)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Serviços (Lógica)             │
│      (beneficio.service)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Models (Tipos)                 │
│  (Beneficio, BeneficioRequest)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      HTTP Client                    │
│      (Backend API)                  │
└─────────────────────────────────────┘
```

### Princípios Aplicados

- **Separação de Responsabilidades**: Cada componente tem uma responsabilidade única
- **Reatividade**: Uso de RxJS para programação reativa
- **Type Safety**: TypeScript com interfaces bem definidas
- **Standalone Components**: Componentes standalone do Angular 17
- **Dependency Injection**: Uso de `inject()` para injeção de dependências

## 🧩 Componentes

### BeneficioListComponent

**Responsabilidade:** Exibir lista de benefícios em tabela

**Funcionalidades:**
- Carregar lista do servidor
- Abrir diálogos de criação/edição
- Abrir diálogo de transferência
- Deletar benefícios
- Formatar valores monetários

**Localização:** `src/app/components/beneficio-list/`

### BeneficioFormComponent

**Responsabilidade:** Formulário para criar/editar benefícios

**Funcionalidades:**
- Validação de formulário
- Modo criação/edição
- Envio de dados para API
- Feedback visual de erros

**Localização:** `src/app/components/beneficio-form/`

### TransferDialogComponent

**Responsabilidade:** Diálogo para transferências

**Funcionalidades:**
- Seleção de origem e destino
- Validação de saldo
- Resumo da transferência
- Validação de origem ≠ destino

**Localização:** `src/app/components/transfer-dialog/`

## 🔌 Serviços

### BeneficioService

**Responsabilidade:** Comunicação com API REST

**Métodos:**
- `findAll()`: Lista todos os benefícios
- `findById(id)`: Busca por ID
- `create(beneficio)`: Cria novo benefício
- `update(id, beneficio)`: Atualiza benefício
- `delete(id)`: Deleta benefício (lógico)
- `transfer(transfer)`: Realiza transferência

**Tratamento de Erros:**
- Intercepta erros HTTP
- Formata mensagens de erro
- Retorna erros tipados

**Localização:** `src/app/services/beneficio.service.ts`

## 🎨 Estilos e Temas

### Tema Material

O projeto utiliza o tema **Indigo-Pink** do Angular Material, configurado em `styles.scss`.

### Estilos Globais

- Scrollbar personalizada
- Animações suaves
- Melhorias de acessibilidade
- Estilos para snackbars de erro

### Responsividade

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Adaptação de tabelas e formulários
- **Mobile**: Layout empilhado, botões em largura total

## ⚠️ Tratamento de Erros

### Tipos de Erro Tratados

1. **Erros de Validação (400)**
   - Campos obrigatórios
   - Valores inválidos
   - Mensagens específicas por campo

2. **Erros de Negócio (422)**
   - Saldo insuficiente
   - Regras de negócio violadas
   - Mensagens amigáveis

3. **Erros de Recurso Não Encontrado (404)**
   - Benefício não existe
   - Mensagem informativa

4. **Erros de Servidor (500)**
   - Erros inesperados
   - Mensagem genérica

5. **Erros de Rede**
   - Falha de conexão
   - Timeout
   - Mensagem de erro de conexão

### Feedback Visual

- **Snackbars** para mensagens temporárias
- **Mensagens inline** nos formulários
- **Estados de loading** durante operações
- **Cores diferenciadas** (sucesso/erro)

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações Mobile

- Tabelas com scroll horizontal
- Botões em largura total
- Formulários empilhados
- Diálogos em tela cheia

## 🔧 Configuração

### Variáveis de Ambiente

**Desenvolvimento** (`environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

**Produção** (`environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api/v1' // Alterar para URL de produção
};
```

### CORS

O backend deve estar configurado para aceitar requisições de `http://localhost:4200`.

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (ex: `BeneficioListComponent`)
- **Serviços**: PascalCase com sufixo Service (ex: `BeneficioService`)
- **Interfaces**: PascalCase (ex: `Beneficio`, `BeneficioRequest`)
- **Variáveis**: camelCase (ex: `beneficios`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_URL`)

### Estrutura de Arquivos

- Um componente por pasta
- Arquivos separados: `.ts`, `.html`, `.scss`
- Nomes consistentes: `component-name.component.*`

### Documentação

- Comentários JSDoc em métodos públicos
- Comentários explicativos em lógica complexa
- README detalhado

## 🧪 Testes

### Executar Testes

```bash
npm test
```

### Cobertura de Testes

- Testes unitários para serviços
- Testes de componentes
- Testes de integração (futuro)

## 🐛 Troubleshooting

### Problemas Comuns

**1. Erro de CORS**
- Verifique se o backend está configurado para aceitar requisições de `localhost:4200`
- Verifique a configuração CORS no backend

**2. Erro ao conectar com API**
- Verifique se o backend está rodando em `http://localhost:8080`
- Verifique a URL da API em `environment.ts`

**3. Erro de compilação**
- Execute `npm install` novamente
- Limpe o cache: `rm -rf node_modules .angular`
- Reinstale: `npm install`

**4. Erro de Material Design**
- Verifique se `@angular/material` está instalado
- Verifique se os módulos estão importados corretamente

## 📚 Recursos Adicionais

- [Documentação Angular](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS](https://rxjs.dev)
- [TypeScript](https://www.typescriptlang.org)

## 👨‍💻 Desenvolvido Por

Este frontend foi desenvolvido como parte do **Desafio Fullstack Integrado**, demonstrando:

- ✅ Arquitetura em camadas
- ✅ Componentes reutilizáveis
- ✅ Tratamento de erros robusto
- ✅ Interface moderna e responsiva
- ✅ Código limpo e bem documentado
- ✅ Boas práticas do Angular 17

---

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2024
