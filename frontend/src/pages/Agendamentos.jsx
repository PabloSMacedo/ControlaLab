import React from 'react';
import Layout from '../components/Layout.jsx';

export default function Agendamentos() {
  // Dados fictícios para simular a massa de dados da Issue #48
  const listaAgendamentos = [
    { id: 1, laboratorio: 'Laboratório de Química', equipamento: 'Autoclave Vertical', data: '10/06/2026', horario: '09:00 - 11:00', pesquisador: 'Dr. Marcos' },
    { id: 2, laboratorio: 'Laboratório de Biologia', equipamento: 'Microscópio Óptico', data: '11/06/2026', horario: '14:00 - 16:00', pesquisador: 'Dra. Ana' },
  ];

  return (
    <Layout>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>📅 Agendamentos de Espaço e Equipamentos</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Gerencie as reservas de horários para a utilização dos recursos laboratoriais.</p>
      </header>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', color: '#555' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Laboratório</th>
              <th style={{ padding: '12px' }}>Equipamento</th>
              <th style={{ padding: '12px' }}>Data</th>
              <th style={{ padding: '12px' }}>Horário</th>
              <th style={{ padding: '12px' }}>Pesquisador</th>
            </tr>
          </thead>
          <tbody>
            {listaAgendamentos.map((agend) => (
              <tr key={agend.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', color: '#777' }}>#{agend.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{agend.laboratorio}</td>
                <td style={{ padding: '12px', color: '#555' }}>{agend.equipamento}</td>
                <td style={{ padding: '12px', color: '#007bff', fontWeight: '500' }}>{agend.data}</td>
                <td style={{ padding: '12px', color: '#555' }}>{agend.horario}</td>
                <td style={{ padding: '12px', color: '#28a745', fontWeight: '500' }}>{agend.pesquisador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}