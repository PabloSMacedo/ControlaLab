import React from 'react';
import Layout from '../components/Layout.jsx';

export default function Equipamentos() {
  // Dados fictícios para demonstração no vídeo posterior
  const listaEquipamentos = [
    { id: 1, nome: 'Microscópio Óptico', marca: 'Nikon', status: 'Ativo' },
    { id: 2, nome: 'Centrífuga Digital', marca: 'Eppendorf', status: 'Em Manutenção' },
    { id: 3, nome: 'Autoclave Vertical', marca: 'Phoenix', status: 'Ativo' },
  ];

  return (
    <Layout>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>💻 Gerenciamento de Equipamentos</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Consulte, adicione e gerencie os dispositivos cadastrados no laboratório.</p>
      </header>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', color: '#555' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>Marca</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {listaEquipamentos.map((equip) => (
              <tr key={equip.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', color: '#777' }}>#{equip.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{equip.nome}</td>
                <td style={{ padding: '12px', color: '#555' }}>{equip.marca}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: equip.status === 'Ativo' ? '#d4edda' : '#fff3cd',
                    color: equip.status === 'Ativo' ? '#155724' : '#856404'
                  }}>{equip.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}