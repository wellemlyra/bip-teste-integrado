import { Routes } from '@angular/router';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';

/**
 * Configuração de rotas da aplicação
 */
export const routes: Routes = [
  {
    path: '',
    component: BeneficioListComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
