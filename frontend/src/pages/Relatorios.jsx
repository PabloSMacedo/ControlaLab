import React from 'react';
import Layout from '../components/Layout.jsx';

export default function Relatorios() {
  return (
    <Layout>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>📋 Relatórios e Logs</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Exporte e analise os dados de uso e eficiência dos laboratórios cadastrados.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Emitir Relatório de Uso</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Gere um arquivo consolidado com a taxa de ocupação dos equipamentos no último mês.</p>
          <button style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Baixar PDF</button>
        </div>

        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Histórico de Incidentes</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Logs contendo falhas registradas durante as sessões de testes operacionais.</p>
          <button style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🔍 Visualizar Logs</button>
        </div>
      </div>
    </Layout>
  );
}