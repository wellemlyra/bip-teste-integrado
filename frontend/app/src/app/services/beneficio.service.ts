import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Beneficio, BeneficioRequest, TransferRequest, ApiError } from '../models/beneficio.model';

/**
 * Serviço responsável por consumir a API REST de Benefícios
 * 
 * Este serviço fornece métodos para:
 * - Listar todos os benefícios
 * - Buscar benefício por ID
 * - Criar novo benefício
 * - Atualizar benefício existente
 * - Deletar benefício (deleção lógica)
 * - Realizar transferência entre benefícios
 */
@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private readonly apiUrl = `${environment.apiUrl}/beneficios`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os benefícios
   * @returns Observable com array de benefícios
   */
  findAll(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca um benefício por ID
   * @param id ID do benefício
   * @returns Observable com o benefício encontrado
   */
  findById(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo benefício
   * @param beneficio Dados do benefício a ser criado
   * @returns Observable com o benefício criado
   */
  create(beneficio: BeneficioRequest): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, beneficio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um benefício existente
   * @param id ID do benefício a ser atualizado
   * @param beneficio Dados atualizados do benefício
   * @returns Observable com o benefício atualizado
   */
  update(id: number, beneficio: BeneficioRequest): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, beneficio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deleta um benefício (deleção lógica - marca como inativo)
   * @param id ID do benefício a ser deletado
   * @returns Observable vazio
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realiza transferência de saldo entre dois benefícios
   * @param transfer Dados da transferência (origem, destino e valor)
   * @returns Observable vazio
   */
  transfer(transfer: TransferRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfer`, transfer).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Trata erros HTTP retornados pela API
   * @param error Erro HTTP
   * @returns Observable com erro tratado
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ocorreu um erro desconhecido';
    let apiError: ApiError | null = null;

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      apiError = error.error as ApiError;
      errorMessage = apiError?.message || `Erro ${error.status}: ${error.statusText}`;
    }

    return throwError(() => ({
      message: errorMessage,
      apiError,
      status: error.status
    }));
  };
}

