import React from 'react';
import Layout from '../components/Layout.jsx';

export default function Dashboard() {
  return (
    <Layout>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>📊 Painel Geral (Dashboard)</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Bem-vindo ao sistema de controle laboratorial ControlaLab.</p>
      </header>

      {/* Cards de resumo com dados fictícios / massas organizadas (Issue #48) */}
      <div style={{ display: 'flex', gap: '25px', wrap: 'wrap' }}>
        <div style={cardStyle}>
          <h3 style={{ color: '#555', marginTop: 0 }}>Total de Equipamentos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', margin: '10px 0 0 0' }}>12</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#555', marginTop: 0 }}>Manutenções Ativas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', margin: '10px 0 0 0' }}>3</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#555', marginTop: 0 }}>Relatórios Emitidos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', margin: '10px 0 0 0' }}>8</p>
        </div>
      </div>
    </Layout>
  );
}

const cardStyle = {
  flex: 1,
  background: 'white',
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  borderLeft: '5px solid #007bff'
};