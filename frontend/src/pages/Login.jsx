import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, obterSessao, salvarSessao } from "../services/api";

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); // Estado para gerenciar mensagens de erro (Issue #54)
  const navigate = useNavigate();

  useEffect(() => {
    if (obterSessao()?.success) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setErro("");

  try {
      const resposta = await apiService.post("login/", {
        login: login,
        password: senha
      });

    salvarSessao(resposta);
    navigate("/dashboard");

  } catch (error) {

    setErro(error.message);

  }
};

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: 'radial-gradient(circle at 20% 20%, rgba(0,92,169,0.18), transparent 32%), linear-gradient(135deg, #f7fbff, #edf3f8)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', 
        padding: '38px',
        borderRadius: '10px',
        boxShadow: '0 20px 48px rgba(0,63,125,0.16)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        width: '360px',
        maxWidth: 'calc(100vw - 32px)'
      }}>
        <h2 style={{ marginBottom: '8px', textAlign: 'center', color: 'var(--senai-blue-dark)', fontSize: '28px' }}>ControlaLab</h2>
        <span className="senai-title-mark" style={{ margin: '0 auto 12px' }}></span>
        <p style={{ marginBottom: '25px', textAlign: 'center', color: '#666', fontSize: '14px' }}>Faça login para acessar o sistema</p>
        
        {/* Exibição condicional da mensagem de erro da Issue #54 */}
        {erro && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            marginBottom: '15px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            ⚠️ {erro}
          </div>
        )}

        <label style={{ marginBottom: '5px', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Usuário ou E-mail:</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '15px'
          }}
          placeholder="Usuário ou e-mail"
        />

        <label style={{ marginBottom: '5px', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Senha:</label>
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
          placeholder="Sua senha"
        />

        <button type="submit" style={{
          padding: '12px', 
          backgroundColor: 'var(--senai-blue)',
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'background-color 0.2s'
        }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
