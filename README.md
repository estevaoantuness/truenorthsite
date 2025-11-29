# TrueNorth

> Copiloto de Importacao - Interface web para validacao automatica de documentos de comercio exterior brasileiro

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Sobre

O **TrueNorth** e uma aplicacao web que ajuda importadores brasileiros a validar documentos de comercio exterior (invoices, DIs) antes do registro no Siscomex, identificando erros que podem causar multas e atrasos.

### Funcionalidades Principais

- **Upload de Documentos**: Suporte a PDF, XML e imagens
- **Extracao Automatica**: Dados extraidos via IA (Gemini)
- **Classificacao NCM**: Sugestao inteligente de codigos NCM
- **Estimativa de Impostos**: Calculo automatico de II, IPI e PIS/COFINS
- **Validacao de Compliance**: Identificacao de anuentes necessarios
- **Deteccao de Subfaturamento**: Alertas de valor/peso suspeito
- **Descricao para DI**: Texto tecnico pronto para Portal Unico
- **Feedback de Especialista**: Dicas autoritativas de consultor via IA
- **Historico de Operacoes**: Acompanhamento por usuario
- **Exportacao PDF**: Relatorios completos

### Stack Tecnologico

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Linguagem**: TypeScript
- **Animacoes**: Framer Motion
- **Icones**: Lucide React
- **PDF**: jsPDF

## Estrutura do Projeto

```
truenorthsite/
├── App.tsx           # Componente principal (all-in-one)
├── api.ts            # Cliente da API TrueNorth
├── index.tsx         # Entry point
├── index.html        # HTML template
├── vite.config.ts    # Configuracao Vite
├── tailwind.config.js
└── package.json
```

## Getting Started

### Pre-requisitos

- Node.js >= 18.0.0
- Backend [TrueNorth API](https://github.com/estevaoantuness/truenorth-api) rodando

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/estevaoantuness/truenorthsite.git
cd truenorthsite

# Instale dependencias
npm install

# Configure a URL da API
cp .env.example .env.local
# Edite VITE_API_URL se necessario
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

# Servir em producao
npm start
```

## Fluxo de Uso

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Login   │───>│  Upload  │───>│ Extracao │───>│ Validacao│
│          │    │  PDF/XML │    │    IA    │    │  Regras  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                                                      ▼
                                               ┌──────────┐
                                               │ Resultado│
                                               │ + Export │
                                               └──────────┘
```

1. **Login/Registro** - Usuario cria conta ou faz login
2. **Upload** - Envia documento (PDF, XML ou imagem)
3. **Extracao** - IA extrai dados automaticamente
4. **Validacao** - Sistema valida contra regras brasileiras
5. **Resultado** - Exibe erros, custos, impostos e recomendacoes
6. **Exportar** - Gera PDF com relatorio completo

## Features da Interface

### Dados Extraidos

- Informacoes do fornecedor (nome, pais)
- Dados do importador (nome, CNPJ)
- Lista de itens com NCM sugerido e confianca
- Valores, incoterms e moeda
- Setor detectado automaticamente

### Impostos Estimados

Card com breakdown completo:
- II (Imposto de Importacao)
- IPI (Imposto sobre Produtos Industrializados)
- PIS/COFINS (11,65%)
- Total estimado
- Base de calculo

### Descricao para DI

- Texto tecnico formatado para Portal Unico
- Botao "Copiar" para clipboard
- Pronto para colar na DI

### Alerta de Subfaturamento

- Banner laranja/vermelho quando detectado
- Analise inteligente por setor

### Feedback de Especialista

- Dicas autoritativas de consultor de comex
- Menciona NCM, pais, riscos especificos
- Referencias normativas (IN RFB, Portarias)

### Validacao

- Lista de erros por severidade
- Custo estimado de cada erro
- Orgaos anuentes necessarios
- Nivel de risco geral (BAIXO/MEDIO/ALTO/CRITICO)

## API Client

O arquivo `api.ts` contem todas as funcoes para comunicacao com o backend:

```typescript
// Autenticacao
register(email, password, confirmPassword, name?)
login(email, password)
getCurrentUser(token)
logout()

// Operacoes
uploadFile(file)                    // Retorna dados extraidos + impostos + feedback
validateOperation(operationId)      // Retorna erros e custos
getOperation(operationId)
listOperations(limit?, offset?)
deleteOperation(operationId)

// Consultas
getNcm(codigo)
searchNcm(query)
getAnuentes()
getTiposErro()
```

### Tipos Principais

```typescript
interface ExtractedData {
  invoice_number: string;
  supplier: { name: string; country: string; };
  items: Array<{
    description: string;
    ncm_sugerido: string;
    ncm_confianca: 'ALTA' | 'MEDIA' | 'BAIXA';
    anuentes_necessarios: string[];
  }>;
  impostos_estimados: {
    ii: number;
    ipi: number;
    pis_cofins: number;
    total_impostos: number;
    base_calculo: number;
  };
  descricao_di: string;
  alerta_subfaturamento: string | null;
  feedback_especialista: string;
}
```

## Scripts

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build para producao |
| `npm run preview` | Preview do build local |
| `npm start` | Servir build em producao (serve) |

## Deploy

### Railway / Vercel / Netlify

1. Conecte o repositorio
2. Configure `VITE_API_URL` apontando para o backend
3. Build command: `npm run build`
4. Output directory: `dist`

### Manual

```bash
# Build
npm run build

# Servir com qualquer servidor estatico
npx serve dist -s
```

## Desenvolvimento

### Estrutura de Componentes

O `App.tsx` contem todos os componentes inline para simplicidade:

- `AuthModal` - Modal de login/registro
- `FileUpload` - Area de upload com drag & drop
- `ProcessingView` - Animacao de processamento
- `ExtractedDataView` - Dados extraidos
- `TaxEstimationCard` - Impostos estimados
- `DIDescriptionCard` - Descricao para DI
- `ValidationResults` - Erros e custos
- `FeedbackCard` - Feedback do especialista
- `OperationsHistory` - Historico do usuario

### Tailwind CSS

O projeto usa Tailwind CSS com tema customizado:
- Primary: Azul (#2563EB)
- Accent: Cyan (#06B6D4)
- Background: Slate escuro (#020817)

## Licenca

MIT License - veja [LICENSE](LICENSE) para detalhes.

## Links

- **Backend**: [truenorth-api](https://github.com/estevaoantuness/truenorth-api)
- **Autor**: Estevao Antunes
