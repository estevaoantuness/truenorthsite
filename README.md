# TrueNorth

> Copiloto de Importacao - Interface web para validacao automatica de documentos de comercio exterior

[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Sobre

TrueNorth e uma aplicacao web que ajuda importadores brasileiros a validar documentos de comercio exterior (invoices, DIs) antes do registro no Siscomex, identificando erros que podem causar multas e atrasos.

### Principais Funcionalidades

- Upload de documentos (PDF, XML, imagens)
- Extracao automatica de dados via IA
- Classificacao NCM inteligente
- Identificacao de orgaos anuentes necessarios
- Calculo de custos potenciais de erros
- Historico de operacoes por usuario
- Exportacao de relatorios em PDF

### Stack Tecnologico

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Linguagem**: TypeScript
- **Animacoes**: Framer Motion
- **Icones**: Lucide React
- **PDF**: jsPDF

## Inicio Rapido

### Pre-requisitos

- Node.js >= 18.0.0
- Backend TrueNorth API rodando

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/estevaoantuness/truenorthsite.git
cd truenorthsite

# Instale dependencias
npm install

# Configure a URL da API
cp .env.example .env.local
```

### Variaveis de Ambiente

| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `VITE_API_URL` | URL do backend TrueNorth API | `http://localhost:3001` |

### Executar

```bash
# Desenvolvimento
npm run dev

# Build para producao
npm run build

# Preview do build
npm run preview
```

## Estrutura do Projeto

```
truenorthsite/
├── App.tsx           # Componente principal
├── api.ts            # Cliente da API
├── index.tsx         # Entry point
├── index.html        # HTML template
├── vite.config.ts    # Configuracao Vite
└── package.json
```

## Fluxo de Uso

1. **Login/Registro** - Usuario cria conta ou faz login
2. **Upload** - Envia documento (PDF, XML ou imagem)
3. **Extracao** - IA extrai dados automaticamente
4. **Validacao** - Sistema valida contra regras brasileiras
5. **Resultado** - Exibe erros, custos e recomendacoes
6. **Exportar** - Gera PDF com relatorio completo

## Funcionalidades da Interface

### Tela de Upload
- Drag and drop de arquivos
- Suporte a PDF, XML, PNG, JPG, WEBP, HEIC
- Preview do arquivo selecionado
- Barra de progresso

### Dados Extraidos
- Informacoes do fornecedor
- Dados do importador
- Lista de itens com NCM sugerido
- Valores e incoterms

### Validacao
- Lista de erros por severidade
- Custo estimado de cada erro
- Orgaos anuentes necessarios
- Nivel de risco geral

### Dashboard
- Total de operacoes
- Custos evitados
- Tempo economizado
- Historico de documentos

## API Client

O arquivo `api.ts` contem todas as funcoes para comunicacao com o backend:

```typescript
// Autenticacao
register(email, password, confirmPassword, name?)
login(email, password)
getCurrentUser(token)
logout()

// Operacoes
uploadFile(file)
validateOperation(operationId)
getOperation(operationId)
listOperations(limit?, offset?)
deleteOperation(operationId)

// Consultas
getNcm(codigo)
searchNcm(query)
getAnuentes()
getTiposErro()
```

## Build e Deploy

```bash
# Build otimizado
npm run build

# Os arquivos estarao em dist/
```

O projeto usa `serve` para servir arquivos estaticos em producao:

```bash
npm start
```

### Deploy no Railway/Vercel

1. Conecte o repositorio
2. Configure `VITE_API_URL` apontando para o backend
3. Build command: `npm run build`
4. Output directory: `dist`

## Desenvolvimento

### Scripts Disponiveis

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para producao |
| `npm run preview` | Preview do build local |
| `npm start` | Servir build em producao |

### Estrutura de Componentes

O `App.tsx` contem todos os componentes inline para simplicidade:

- `LoginModal` - Modal de autenticacao
- `FileUpload` - Area de upload
- `ExtractedDataView` - Visualizacao dos dados
- `ValidationResults` - Resultados da validacao
- `OperationsHistory` - Historico do usuario

## Licenca

MIT License - veja [LICENSE](LICENSE) para detalhes.

## Links Relacionados

- **Backend**: [truenorth-api](https://github.com/estevaoantuness/truenorth-api)
- **Autor**: Estevao Antunes
