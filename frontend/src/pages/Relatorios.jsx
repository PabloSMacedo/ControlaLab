import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { apiService } from '../services/api';

export default function Relatorios() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    setCarregando(true);
    setErro('');

    try {
      const [resumo, equipamentos, manutencoes, agendamentos] = await Promise.all([
        apiService.get('relatorios/resumo/'),
        apiService.get('relatorios/equipamentos/'),
        apiService.get('relatorios/manutencoes/'),
        apiService.get('relatorios/agendamentos/'),
      ]);

      setDados({ resumo, equipamentos, manutencoes, agendamentos });
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const resumoCards = [
    ['Equipamentos', dados?.resumo.total_equipamentos ?? 0],
    ['Manutenções', dados?.resumo.total_manutencoes ?? 0],
    ['Agendamentos', dados?.resumo.total_agendamentos ?? 0],
    ['Ativos', dados?.resumo.equipamentos_ativos ?? 0],
  ];

  return (
    <Layout>
      <header style={headerStyle}>
        <h1 style={{ color: 'var(--senai-blue-dark)', margin: 0 }}>📋 Relatórios</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Consulte os dados consolidados do ControlaLab.</p>
      </header>

      {carregando && <p style={infoStyle}>Carregando relatórios...</p>}
      {erro && <p style={errorStyle}>{erro}</p>}

      {!carregando && !erro && dados && (
        <>
          <div style={cardsGridStyle}>
            {resumoCards.map(([titulo, valor]) => (
              <div key={titulo} className="page-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--muted)', marginTop: 0 }}>{titulo}</h3>
                <p style={{ color: 'var(--senai-blue)', fontWeight: 'bold', fontSize: '28px', margin: 0 }}>{valor}</p>
              </div>
            ))}
          </div>

          <section className="page-panel" style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Equipamentos por status</h2>
            <div style={statusGridStyle}>
              {Object.entries(dados.equipamentos.agrupamento_por_status).map(([status, total]) => (
                <div key={status} style={statusItemStyle}>
                  <strong>{status}</strong>
                  <span>{total}</span>
                </div>
              ))}
              {Object.keys(dados.equipamentos.agrupamento_por_status).length === 0 && (
                <p style={{ color: '#777' }}>Nenhum equipamento cadastrado.</p>
              )}
            </div>
          </section>

          <section className="page-panel" style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Equipamentos</h2>
            <Tabela
              colunas={['Nome', 'Patrimônio', 'Localização', 'Status']}
              linhas={dados.equipamentos.equipamentos.map((equipamento) => [
                equipamento.nome,
                equipamento.patrimonio,
                equipamento.localizacao,
                equipamento.status,
              ])}
              vazio="Nenhum equipamento cadastrado."
            />
          </section>

          <section className="page-panel" style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Manutenções</h2>
            <Tabela
              colunas={['Equipamento', 'Descrição', 'Data']}
              linhas={dados.manutencoes.manutencoes.map((manutencao) => [
                manutencao.equipamento,
                manutencao.descricao,
                manutencao.data,
              ])}
              vazio="Nenhuma manutenção cadastrada."
            />
          </section>

          <section className="page-panel" style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Agendamentos</h2>
            <Tabela
              colunas={['Usuário', 'Equipamento', 'Data']}
              linhas={dados.agendamentos.agendamentos.map((agendamento) => [
                agendamento.usuario,
                agendamento.equipamento,
                agendamento.data,
              ])}
              vazio="Nenhum agendamento cadastrado."
            />
          </section>
        </>
      )}
    </Layout>
  );
}

function Tabela({ colunas, linhas, vazio }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr style={theadRowStyle}>
            {colunas.map((coluna) => (
              <th key={coluna} style={cellStyle}>{coluna}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.length === 0 && (
            <tr>
              <td colSpan={colunas.length} style={emptyStyle}>{vazio}</td>
            </tr>
          )}

          {linhas.map((linha, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
              {linha.map((valor, cellIndex) => (
                <td key={`${index}-${cellIndex}`} style={cellStyle}>{valor}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  borderBottom: '1px solid var(--line)',
  paddingBottom: '15px',
  marginBottom: '25px',
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '16px',
  marginBottom: '20px',
};

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  borderLeft: '5px solid var(--senai-blue)',
};

const sectionStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
};

const sectionTitleStyle = {
  color: 'var(--senai-blue-dark)',
  fontSize: '20px',
  marginTop: 0,
};

const statusGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '12px',
};

const statusItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  background: 'var(--senai-sky)',
  borderRadius: '8px',
  color: 'var(--senai-blue-dark)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const theadRowStyle = {
  borderBottom: '2px solid var(--line)',
  color: 'var(--muted)',
};

const cellStyle = {
  padding: '12px',
  color: 'var(--ink)',
};

const emptyStyle = {
  ...cellStyle,
  textAlign: 'center',
  color: '#777',
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
