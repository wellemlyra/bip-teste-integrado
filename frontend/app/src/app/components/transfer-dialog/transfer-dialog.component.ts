import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio, TransferRequest } from '../../models/beneficio.model';

/**
 * Componente de diálogo para realizar transferências entre benefícios
 * 
 * Este componente permite:
 * - Selecionar benefício de origem
 * - Selecionar benefício de destino
 * - Informar valor da transferência
 * - Validar saldo suficiente
 * - Exibir informações dos benefícios selecionados
 */
@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss'
})
export class TransferDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private beneficioService = inject(BeneficioService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TransferDialogComponent>);
  private beneficios = inject<Beneficio[]>(MAT_DIALOG_DATA);

  transferForm!: FormGroup;
  loading = false;
  beneficiosAtivos: Beneficio[] = [];

  ngOnInit(): void {
    // Filtra apenas benefícios ativos para transferência
    this.beneficiosAtivos = this.beneficios.filter(b => b.ativo);
    this.initializeForm();
  }

  /**
   * Inicializa o formulário de transferência
   */
  private initializeForm(): void {
    this.transferForm = this.fb.group({
      fromId: ['', Validators.required],
      toId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]]
    }, {
      validators: this.differentBeneficiosValidator.bind(this)
    });

    // Atualiza validação quando origem ou destino mudam
    this.transferForm.get('fromId')?.valueChanges.subscribe(() => {
      this.transferForm.get('amount')?.updateValueAndValidity();
    });
  }

  /**
   * Validador customizado para garantir que origem e destino sejam diferentes
   */
  private differentBeneficiosValidator(group: FormGroup): { [key: string]: any } | null {
    const fromId = group.get('fromId')?.value;
    const toId = group.get('toId')?.value;

    if (fromId && toId && fromId === toId) {
      return { sameBeneficio: true };
    }

    return null;
  }

  /**
   * Retorna o benefício selecionado como origem
   */
  get selectedFromBeneficio(): Beneficio | undefined {
    const fromId = this.transferForm.get('fromId')?.value;
    return this.beneficiosAtivos.find(b => b.id === fromId);
  }

  /**
   * Retorna o benefício selecionado como destino
   */
  get selectedToBeneficio(): Beneficio | undefined {
    const toId = this.transferForm.get('toId')?.value;
    return this.beneficiosAtivos.find(b => b.id === toId);
  }

  /**
   * Verifica se o valor da transferência é maior que o saldo disponível
   */
  get hasInsufficientBalance(): boolean {
    const fromBeneficio = this.selectedFromBeneficio;
    const amount = this.transferForm.get('amount')?.value;
    
    if (!fromBeneficio || !amount) {
      return false;
    }

    return amount > fromBeneficio.valor;
  }

  /**
   * Submete o formulário para realizar a transferência
   */
  onSubmit(): void {
    if (this.transferForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.hasInsufficientBalance) {
      this.showError('Saldo insuficiente para realizar a transferência!');
      return;
    }

    this.loading = true;
    const formValue = this.transferForm.value;
    const transferRequest: TransferRequest = {
      fromId: formValue.fromId,
      toId: formValue.toId,
      amount: formValue.amount
    };

    this.beneficioService.transfer(transferRequest).subscribe({
      next: () => {
        this.showSuccess('Transferência realizada com sucesso!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.showError('Erro ao realizar transferência: ' + error.message);
        this.loading = false;
      }
    });
  }

  /**
   * Marca todos os campos do formulário como touched para exibir erros
   */
  private markFormGroupTouched(): void {
    Object.keys(this.transferForm.controls).forEach(key => {
      const control = this.transferForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Fecha o diálogo sem realizar transferência
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Retorna mensagem de erro para um campo específico
   */
  getErrorMessage(fieldName: string): string {
    const control = this.transferForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control?.hasError('min')) {
      return 'O valor deve ser maior que zero';
    }
    
    // Validação de origem e destino diferentes
    if (this.transferForm.hasError('sameBeneficio')) {
      return 'Origem e destino devem ser diferentes';
    }
    
    return '';
  }

  /**
   * Verifica se um campo tem erro e foi tocado
   */
  hasError(fieldName: string): boolean {
    const control = this.transferForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Formata um valor numérico como moeda brasileira
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Exibe mensagem de sucesso
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Exibe mensagem de erro
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
