import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';

/**
 * Componente raiz da aplicação
 * 
 * Este componente serve como container principal e define:
 * - Header com título e descrição
 * - Área principal para rotas
 * - Footer com informações do sistema
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    BeneficioListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Sistema de Gestão de Benefícios';
}
