import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import { BeneficioFormComponent } from '../beneficio-form/beneficio-form.component';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';

/**
 * Componente responsável por exibir a lista de benefícios em uma tabela
 * 
 * Funcionalidades:
 * - Lista todos os benefícios
 * - Permite editar benefícios
 * - Permite deletar benefícios (deleção lógica)
 * - Permite realizar transferências
 * - Exibe status ativo/inativo
 * - Formata valores monetários
 */
@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './beneficio-list.component.html',
  styleUrl: './beneficio-list.component.scss'
})
export class BeneficioListComponent implements OnInit {
  private beneficioService = inject(BeneficioService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  beneficios: Beneficio[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'valor', 'ativo', 'acoes'];
  loading = false;

  ngOnInit(): void {
    this.loadBeneficios();
  }

  /**
   * Carrega a lista de benefícios do servidor
   */
  loadBeneficios(): void {
    this.loading = true;
    this.beneficioService.findAll().subscribe({
      next: (beneficios) => {
        this.beneficios = beneficios;
        this.loading = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar benefícios: ' + error.message);
        this.loading = false;
      }
    });
  }

  /**
   * Abre o diálogo de formulário para criar um novo benefício
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(BeneficioFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBeneficios();
      }
    });
  }

  /**
   * Abre o diálogo de formulário para editar um benefício existente
   */
  openEditDialog(beneficio: Beneficio): void {
    const dialogRef = this.dialog.open(BeneficioFormComponent, {
      width: '600px',
      data: beneficio
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBeneficios();
      }
    });
  }

  /**
   * Abre o diálogo de transferência
   */
  openTransferDialog(): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: '500px',
      data: this.beneficios
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBeneficios();
      }
    });
  }

  /**
   * Deleta um benefício (deleção lógica)
   */
  deleteBeneficio(beneficio: Beneficio): void {
    if (!confirm(`Tem certeza que deseja desativar o benefício "${beneficio.nome}"?`)) {
      return;
    }

    this.beneficioService.delete(beneficio.id).subscribe({
      next: () => {
        this.showSuccess('Benefício desativado com sucesso!');
        this.loadBeneficios();
      },
      error: (error) => {
        this.showError('Erro ao desativar benefício: ' + error.message);
      }
    });
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
