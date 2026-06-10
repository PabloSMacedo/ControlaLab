import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Função simples para destacar o botão da página onde o usuário está
  const getButtonStyle = (path) => {
    const isCurrent = location.pathname === path;
    return {
      padding: '12px 15px',
      backgroundColor: isCurrent ? '#007bff' : '#2d333f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%',
      fontWeight: 'bold',
      transition: 'background-color 0.2s',
    };
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9' }}>
      
      {/* 🧭 Menu Lateral - Requisito da Issue #49 */}
      <aside style={{ width: '260px', backgroundColor: '#1e2229', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff', letterSpacing: '1px' }}>ControlaLab</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
          <button onClick={() => navigate('/dashboard')} style={getButtonStyle('/dashboard')}>📊 Dashboard</button>
          <button onClick={() => navigate('/equipamentos')} style={getButtonStyle('/equipamentos')}>💻 Equipamentos</button>
          <button onClick={() => navigate('/manutencoes')} style={getButtonStyle('/manutencoes')}>🔧 Manutenções</button>
          <button onClick={() => navigate('/agendamentos')} style={getButtonStyle('/agendamentos')}>📅 Agendamentos</button>
          <button onClick={() => navigate('/relatorios')} style={getButtonStyle('/relatorios')}>📋 Relatórios</button>
        </nav>

        {/* Botão de Sair */}
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' }}
        >
          🚪 Sair
        </button>
      </aside>

      {/* 🖥️ Área Direita (Cabeçalho + Conteúdo Principal) */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* 🔲 Cabeçalho - Requisito da Issue #49 */}
        <header style={{ height: '60px', backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#28a745', borderRadius: '50%' }}></span>
            <span style={{ fontWeight: '500', color: '#555' }}>Painel do Pesquisador</span>
          </div>
        </header>

        {/* 📄 Área Principal do Conteúdo */}
        <main style={{ padding: '30px', flexGrow: 1 }}>
          {children}
        </main>
      </div>

    </div>
  );
}