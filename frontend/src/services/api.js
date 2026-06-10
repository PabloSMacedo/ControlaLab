// Configuração centralizada da API (Requisito da Issue #51)

// URL base que o backend do seu grupo vai rodar (geralmente porta 3000 ou 5000)
const API_URL = 'http://localhost:3000/api'; 

export const apiService = {
  // Exemplo de chamada genérica pronta para buscar dados
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) throw new Error('Erro na requisição');
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error);
      throw error;
    }
  },

  // Exemplo de chamada genérica pronta para enviar dados
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao enviar dados');
      return await response.json();
    } catch (error) {
      console.error(`Erro ao enviar dados para ${endpoint}:`, error);
      throw error;
    }
  }
};