import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService, limparSessao, obterSessao } from "../services/api";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sessao = obterSessao();

  const handleLogout = async () => {

  try {

    await apiService.post("logout/", {});

  } catch (error) {

    console.error(error);

  } finally {

    limparSessao();
    navigate("/login");

  }

};

  // Função simples para destacar o botão da página onde o usuário está
  const getButtonStyle = (path) => {
    const isCurrent = location.pathname === path;
    return {
      padding: '12px 14px',
      backgroundColor: isCurrent ? 'var(--senai-blue)' : 'transparent',
      color: 'white',
      border: isCurrent ? '1px solid rgba(255,255,255,0.38)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%',
      fontWeight: isCurrent ? 'bold' : '500',
      boxShadow: isCurrent ? '0 8px 18px rgba(0, 92, 169, 0.28)' : 'none',
      transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: 'transparent' }}>
      
      {/* 🧭 Menu Lateral - Requisito da Issue #49 */}
      <aside style={{ width: '250px', background: 'linear-gradient(180deg, var(--senai-blue-dark) 0%, #06294f 100%)', color: 'white', padding: '22px', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 18px rgba(0,63,125,0.2)' }}>
        <h2 style={{ textAlign: 'left', margin: '0 0 6px 0', color: 'white', letterSpacing: '0.5px' }}>ControlaLab</h2>
        <span className="senai-title-mark"></span>
        <p style={{ color: '#9ca3af', margin: '0 0 28px 0', fontSize: '13px' }}>Gestão laboratorial</p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
          <button onClick={() => navigate('/dashboard')} style={getButtonStyle('/dashboard')}>📊 Dashboard</button>
          <button onClick={() => navigate('/equipamentos')} style={getButtonStyle('/equipamentos')}>💻 Equipamentos</button>
          <button onClick={() => navigate('/manutencoes')} style={getButtonStyle('/manutencoes')}>🔧 Manutenções</button>
          <button onClick={() => navigate('/agendamentos')} style={getButtonStyle('/agendamentos')}>📅 Agendamentos</button>
          <button onClick={() => navigate('/relatorios')} style={getButtonStyle('/relatorios')}>📋 Relatórios</button>
        </nav>

        {/* Botão de Sair */}
        <button 
          onClick={handleLogout}
          style={{ padding: '12px', backgroundColor: 'var(--senai-red)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' }}
        >
          🚪 Sair
        </button>
      </aside>

      {/* 🖥️ Área Direita (Cabeçalho + Conteúdo Principal) */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* 🔲 Cabeçalho - Requisito da Issue #49 */}
        <header style={{ minHeight: '64px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#18a058', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(24,160,88,0.12)' }}></span>
            <span style={{ fontWeight: '600', color: 'var(--senai-blue-dark)' }}>{sessao?.username || 'Painel do Pesquisador'}</span>
          </div>
        </header>

        {/* 📄 Área Principal do Conteúdo */}
        <main style={{ padding: '28px', flexGrow: 1 }}>
          {children}
        </main>
      </div>

    </div>
  );
}
