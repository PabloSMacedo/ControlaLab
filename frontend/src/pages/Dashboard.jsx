import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { apiService } from '../services/api';

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    setCarregando(true);
    setErro('');

    try {
      const dados = await apiService.get('relatorios/resumo/');
      setResumo(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const cards = [
    ['Total de Equipamentos', resumo?.total_equipamentos ?? 0, 'var(--senai-blue)'],
    ['Manutenções', resumo?.total_manutencoes ?? 0, 'var(--senai-red)'],
    ['Agendamentos', resumo?.total_agendamentos ?? 0, 'var(--senai-blue-dark)'],
    ['Ativos', resumo?.equipamentos_ativos ?? 0, '#18a058'],
    ['Em Manutenção', resumo?.equipamentos_em_manutencao ?? 0, '#d97706'],
    ['Inativos', resumo?.equipamentos_inativos ?? 0, '#64748b'],
  ];

  return (
    <Layout>
      <header style={{ borderBottom: '1px solid var(--line)', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: 'var(--senai-blue-dark)', margin: 0 }}>📊 Painel Geral (Dashboard)</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Bem-vindo ao sistema de controle laboratorial ControlaLab.</p>
      </header>

      {carregando && <p style={infoStyle}>Carregando dados...</p>}
      {erro && <p style={errorStyle}>{erro}</p>}

      {!carregando && !erro && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {cards.map(([titulo, valor, cor]) => (
            <div key={titulo} className="page-panel" style={{ ...cardStyle, borderLeft: `5px solid ${cor}` }}>
              <h3 style={{ color: 'var(--muted)', marginTop: 0 }}>{titulo}</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: cor, margin: '10px 0 0 0' }}>{valor}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

const cardStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '10px',
};

const infoStyle = {
  background: 'white',
  padding: '15px',
  borderRadius: '8px',
  color: '#555',
};

const errorStyle = {
  ...infoStyle,
  color: '#721c24',
  background: '#f8d7da',
  border: '1px solid #f5c6cb',
};
