// TrueNorth API Client
// Conecta o frontend ao backend real

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Tipos
export interface ExtractedData {
  invoice_number: string;
  invoice_date: string;
  supplier: {
    name: string;
    address: string;
    country: string;
  };
  buyer: {
    name: string;
    cnpj: string;
  };
  incoterm: string | null;
  currency: string;
  total_value: number;
  freight: number | null;
  insurance: number | null;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;
    ncm_sugerido: string;
    peso_kg: number | null;
    origem: string | null;
  }>;
  observacoes: string[];
  campos_faltando: string[];
}

export interface ValidationResult {
  validacoes: Array<{
    campo: string;
    valor_encontrado: string | number | null;
    valor_esperado: string | number | null;
    status: 'OK' | 'ALERTA' | 'ERRO';
    codigo_erro?: string;
    explicacao: string;
    fonte: string;
    sugestao_correcao?: string;
  }>;
  erros: Array<{
    tipo_erro: string;
    campo: string;
    valor_original: any;
    valor_esperado: any;
    explicacao: string;
    fonte: string;
    custo_estimado?: number;
    severidade?: string;
  }>;
  custos: {
    custoMultas: number;
    custoDemurrage: number;
    custoTotal: number;
    diasAtrasoEstimado: number;
    detalhamento: Array<{
      erro: string;
      custoMulta: number;
      custoDemurrage: number;
      diasAtraso: number;
      calculo: string;
    }>;
  };
  anuentes_necessarios: string[];
  risco_geral: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
}

export interface Operation {
  id: string;
  arquivoNome: string;
  arquivoTipo: string;
  status: string;
  dadosExtraidos: ExtractedData | null;
  dadosValidados: any | null;
  erros: any[];
  custoTotalErros: number | null;
  tempoEconomizadoMin: number | null;
  createdAt: string;
}

// API Functions

export async function uploadFile(file: File): Promise<{ operationId: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer upload');
  }

  return response.json();
}

export async function processDocument(operationId: string): Promise<{
  operationId: string;
  extractedData: ExtractedData;
  processingTime: string;
}> {
  const response = await fetch(`${API_URL}/api/process/${operationId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao processar documento');
  }

  return response.json();
}

export async function validateOperation(operationId: string): Promise<ValidationResult & { operationId: string }> {
  const response = await fetch(`${API_URL}/api/validate/${operationId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao validar operação');
  }

  return response.json();
}

export async function getOperation(operationId: string): Promise<Operation> {
  const response = await fetch(`${API_URL}/api/operations/${operationId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar operação');
  }

  return response.json();
}

export async function listOperations(): Promise<Operation[]> {
  const response = await fetch(`${API_URL}/api/operations`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao listar operações');
  }

  return response.json();
}

export async function getNcm(ncm: string): Promise<{
  ncm: string;
  descricao: string;
  aliquotaIi: string;
  aliquotaIpi: string;
  anuentes: string[];
  requerLpco: boolean;
  setor: string;
  anuentesDetalhes: any[];
}> {
  const response = await fetch(`${API_URL}/api/ncm/${ncm}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'NCM não encontrado');
  }

  return response.json();
}

export async function searchNcm(query: string): Promise<Array<{
  ncm: string;
  descricao: string;
  setor: string;
}>> {
  const response = await fetch(`${API_URL}/api/ncm/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getAnuentes(): Promise<Array<{
  sigla: string;
  nomeCompleto: string;
  descricao: string;
  multaMinima: string;
  multaMaxima: string;
  tempoLiberacaoDias: number;
}>> {
  const response = await fetch(`${API_URL}/api/validate/anuentes`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getTiposErro(): Promise<Array<{
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  custoBase: string;
  custoPercentual: string;
  custoMaximo: string;
  diasAtrasoMedio: number;
  severidade: string;
}>> {
  const response = await fetch(`${API_URL}/api/validate/tipos-erro`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}

// Demo endpoint (for examples without file upload)
export async function processDemoInvoice(invoiceKey: string): Promise<{
  operationId: string;
  extractedData: ExtractedData;
}> {
  const response = await fetch(`${API_URL}/api/process/demo/${invoiceKey}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao processar demo');
  }

  return response.json();
}

// Full flow helper - uploads, processes, and validates
export async function processFullFlow(file: File, onProgress?: (step: string, progress: number) => void): Promise<{
  operation: Operation;
  extractedData: ExtractedData;
  validation: ValidationResult;
}> {
  onProgress?.('upload', 10);
  const { operationId } = await uploadFile(file);

  onProgress?.('processing', 40);
  const { extractedData } = await processDocument(operationId);

  onProgress?.('validating', 70);
  const validation = await validateOperation(operationId);

  onProgress?.('complete', 100);
  const operation = await getOperation(operationId);

  return { operation, extractedData, validation };
}
