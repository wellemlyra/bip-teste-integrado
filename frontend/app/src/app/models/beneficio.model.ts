/**
 * Modelo de dados para Benefício
 * Representa a estrutura de dados retornada pela API
 */
export interface Beneficio {
  id: number;
  nome: string;
  descricao?: string;
  valor: number;
  ativo: boolean;
}

/**
 * Modelo de dados para requisição de criação/atualização de Benefício
 */
export interface BeneficioRequest {
  nome: string;
  descricao?: string;
  valor: number;
  ativo?: boolean;
}

/**
 * Modelo de dados para requisição de transferência
 */
export interface TransferRequest {
  fromId: number;
  toId: number;
  amount: number;
}

/**
 * Modelo de erro retornado pela API
 */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: { [key: string]: string };
}

