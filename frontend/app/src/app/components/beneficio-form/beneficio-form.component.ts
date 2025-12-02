import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio, BeneficioRequest } from '../../models/beneficio.model';

/**
 * Componente de formulário para criar ou editar benefícios
 * 
 * Este componente é usado como diálogo modal e permite:
 * - Criar novos benefícios
 * - Editar benefícios existentes
 * - Validar dados antes de enviar
 * - Exibir mensagens de erro/sucesso
 */
@Component({
  selector: 'app-beneficio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './beneficio-form.component.html',
  styleUrl: './beneficio-form.component.scss'
})
export class BeneficioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private beneficioService = inject(BeneficioService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BeneficioFormComponent>);
  private data = inject<Beneficio | null>(MAT_DIALOG_DATA);

  beneficioForm!: FormGroup;
  isEditMode = false;
  loading = false;

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initializeForm();
  }

  /**
   * Inicializa o formulário com valores padrão ou do benefício sendo editado
   */
  private initializeForm(): void {
    this.beneficioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(255)]],
      valor: [0, [Validators.required, Validators.min(0)]],
      ativo: [true]
    });

    if (this.isEditMode && this.data) {
      this.beneficioForm.patchValue({
        nome: this.data.nome,
        descricao: this.data.descricao || '',
        valor: this.data.valor,
        ativo: this.data.ativo
      });
    }
  }

  /**
   * Submete o formulário para criar ou atualizar o benefício
   */
  onSubmit(): void {
    if (this.beneficioForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.beneficioForm.value;
    const beneficioRequest: BeneficioRequest = {
      nome: formValue.nome.trim(),
      descricao: formValue.descricao?.trim() || undefined,
      valor: formValue.valor,
      ativo: formValue.ativo
    };

    if (this.isEditMode && this.data) {
      this.updateBeneficio(beneficioRequest);
    } else {
      this.createBeneficio(beneficioRequest);
    }
  }

  /**
   * Cria um novo benefício
   */
  private createBeneficio(beneficio: BeneficioRequest): void {
    this.beneficioService.create(beneficio).subscribe({
      next: () => {
        this.showSuccess('Benefício criado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.showError('Erro ao criar benefício: ' + error.message);
        this.loading = false;
      }
    });
  }

  /**
   * Atualiza um benefício existente
   */
  private updateBeneficio(beneficio: BeneficioRequest): void {
    if (!this.data) return;

    this.beneficioService.update(this.data.id, beneficio).subscribe({
      next: () => {
        this.showSuccess('Benefício atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.showError('Erro ao atualizar benefício: ' + error.message);
        this.loading = false;
      }
    });
  }

  /**
   * Marca todos os campos do formulário como touched para exibir erros
   */
  private markFormGroupTouched(): void {
    Object.keys(this.beneficioForm.controls).forEach(key => {
      const control = this.beneficioForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Fecha o diálogo sem salvar
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Retorna mensagem de erro para um campo específico
   */
  getErrorMessage(fieldName: string): string {
    const control = this.beneficioForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return 'O valor deve ser maior ou igual a zero';
    }
    return '';
  }

  /**
   * Verifica se um campo tem erro e foi tocado
   */
  hasError(fieldName: string): boolean {
    const control = this.beneficioForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
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
