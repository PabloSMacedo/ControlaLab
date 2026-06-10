import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); // Estado para gerenciar mensagens de erro (Issue #54)
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro(''); // Limpa os erros anteriores

    // Validação dos requisitos da Issue #54
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Simulação temporária de validação de e-mail básico
    if (!email.includes('@')) {
      setErro('Por favor, insira um e-mail válido!');
      return;
    }

    // Se passou na validação, navega direto para o Dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f4f4f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        width: '320px'
      }}>
        <h2 style={{ marginBottom: '10px', textAlign: 'center', color: '#333' }}>ControlaLab</h2>
        <p style={{ marginBottom: '25px', textAlign: 'center', color: '#666', fontSize: '14px' }}>Faça login para acessar o sistema</p>
        
        {/* Exibição condicional da mensagem de erro da Issue #54 */}
        {erro && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
            marginBottom: '15px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            ⚠️ {erro}
          </div>
        )}

        <label style={{ marginBottom: '5px', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>E-mail:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }}
          placeholder="seuemail@exemplo.com"
        />

        <label style={{ marginBottom: '5px', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Senha:</label>
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }}
          placeholder="Sua senha"
        />

        <button type="submit" style={{
          padding: '12px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
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