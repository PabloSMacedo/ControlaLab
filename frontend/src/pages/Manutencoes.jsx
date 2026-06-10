import React from 'react';
import Layout from '../components/Layout.jsx';

export default function Manutencoes() {
  const listaManutencoes = [
    { id: 101, equipamento: 'Centrífuga Digital', tipo: 'Corretiva', data: '12/06/2026', responsavel: 'Técnico Carlos' },
    { id: 102, equipamento: 'Microscópio Óptico', tipo: 'Preventiva', data: '18/06/2026', responsavel: 'Laboratório Central' },
  ];

  return (
    <Layout>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>🔧 Controle de Manutenções</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Acompanhe os reparos preventivos e corretivos agendados para os equipamentos.</p>
      </header>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', color: '#555' }}>
              <th style={{ padding: '12px' }}>Cód.</th>
              <th style={{ padding: '12px' }}>Equipamento</th>
              <th style={{ padding: '12px' }}>Tipo</th>
              <th style={{ padding: '12px' }}>Data Agendada</th>
              <th style={{ padding: '12px' }}>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {listaManutencoes.map((manut) => (
              <tr key={manut.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', color: '#777' }}>{manut.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{manut.equipamento}</td>
                <td style={{ padding: '12px', color: '#555' }}>{manut.tipo}</td>
                <td style={{ padding: '12px', color: '#007bff', fontWeight: '500' }}>{manut.data}</td>
                <td style={{ padding: '12px', color: '#555' }}>{manut.responsavel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}