/**
 * Configuração de ambiente para produção
 * 
 * No Docker, o nginx faz proxy para /api, então usamos caminho relativo
 */
export const environment = {
  production: true,
  apiUrl: '/api/v1'
};

