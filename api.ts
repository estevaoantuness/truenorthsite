// TrueNorth API Client
// Conecta o frontend ao backend real

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth Functions
export async function register(email: string, password: string, confirmPassword: string, name?: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar conta');
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<{ user: User }> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao verificar autenticação');
  }

  return response.json();
}

// Auth helpers
export function getStoredToken(): string | null {
  return localStorage.getItem('truenorth_token');
}

export function setStoredToken(token: string): void {
  localStorage.setItem('truenorth_token', token);
}

export function removeStoredToken(): void {
  localStorage.removeItem('truenorth_token');
}

export function getStoredUser(): User | null {
  const userStr = localStorage.getItem('truenorth_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredUser(user: User): void {
  localStorage.setItem('truenorth_user', JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem('truenorth_user');
}

export function logout(): void {
  removeStoredToken();
  removeStoredUser();
}

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

  const data = await response.json();

  // Map backend field name to frontend expected name
  const extractedData = data.dadosExtraidos || data.extractedData || { items: [] };

  return {
    operationId: data.operationId,
    extractedData,
    processingTime: data.processingTime || '0s',
  };
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

export interface OperationsResponse {
  operations: Operation[];
  total: number;
  limit: number;
  offset: number;
}

export interface OperationsStats {
  totalOperations: number;
  operationsWithErrors: number;
  operationsValidated: number;
  totalCostsAvoided: number;
  totalTimeSavedMin: number;
  averageTimeSavedMin: number;
}

export async function listOperations(limit = 10, offset = 0): Promise<OperationsResponse> {
  const response = await fetch(`${API_URL}/api/operations?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao listar operações');
  }

  return response.json();
}

export async function getOperationsStats(): Promise<OperationsStats> {
  const response = await fetch(`${API_URL}/api/operations/stats/summary`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar estatísticas');
  }

  return response.json();
}

export async function deleteOperation(operationId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/operations/${operationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir operação');
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
