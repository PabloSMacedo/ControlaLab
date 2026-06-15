import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Pagination from '../components/Pagination.jsx';
import { apiService } from '../services/api';

const manutencaoInicial = {
  equipamento_id: '',
  descricao: '',
  data: '',
};

export default function Manutencoes() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [form, setForm] = useState(manutencaoInicial);
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [equipamentoFiltro, setEquipamentoFiltro] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busca, equipamentoFiltro, itensPorPagina, manutencoes.length]);

  const manutencoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return manutencoes.filter((manutencao) => {
      const combinaBusca = [manutencao.equipamento, manutencao.descricao, manutencao.data]
        .join(' ')
        .toLowerCase()
        .includes(termo);

      const combinaEquipamento = equipamentoFiltro === 'Todos' || String(manutencao.equipamento_id) === equipamentoFiltro;

      return combinaBusca && combinaEquipamento;
    });
  }, [busca, equipamentoFiltro, manutencoes]);

  const manutencoesPagina = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return manutencoesFiltradas.slice(inicio, inicio + itensPorPagina);
  }, [manutencoesFiltradas, pagina, itensPorPagina]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');

    try {
      const [listaEquipamentos, listaManutencoes] = await Promise.all([
        apiService.get('equipamentos/'),
        apiService.get('manutencoes/'),
      ]);

      setEquipamentos(listaEquipamentos);
      setManutencoes(listaManutencoes);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarCampo = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const limparFormulario = () => {
    setForm(manutencaoInicial);
    setEditando(null);
  };

  const salvarManutencao = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setSalvando(true);

    try {
      if (editando) {
        await apiService.put(`manutencoes/${editando}/editar/`, form);
        setMensagem('Manutenção atualizada com sucesso.');
      } else {
        await apiService.post('manutencoes/cadastrar/', form);
        setMensagem('Manutenção cadastrada com sucesso.');
      }

      limparFormulario();
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (manutencao) => {
    setEditando(manutencao.id);
    setForm({
      equipamento_id: String(manutencao.equipamento_id),
      descricao: manutencao.descricao,
      data: manutencao.data,
    });
    setMensagem('');
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removerManutencao = async (manutencao) => {
    if (!confirm(`Remover a manutenção #${manutencao.id}?`)) {
      return;
    }

    setMensagem('');
    setErro('');

    try {
      await apiService.delete(`manutencoes/${manutencao.id}/remover/`);
      setMensagem('Manutenção removida com sucesso.');
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  };

  const mudarPagina = (novaPagina) => {
    const totalPaginas = Math.max(1, Math.ceil(manutencoesFiltradas.length / itensPorPagina));
    setPagina(Math.min(Math.max(novaPagina, 1), totalPaginas));
  };

  return (
    <Layout>
      <header style={headerStyle}>
        <h1 style={{ color: 'var(--senai-blue-dark)', margin: 0 }}>🔧 Controle de Manutenções</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Acompanhe os reparos preventivos e corretivos dos equipamentos.</p>
      </header>

      {mensagem && <p style={successStyle}>{mensagem}</p>}
      {erro && <p style={errorStyle}>{erro}</p>}

      <section className="page-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 className="section-heading">{editando ? 'Editar manutenção' : 'Nova manutenção'}</h2>

        <form onSubmit={salvarManutencao} style={formStyle}>
          <label className="field-label">
            Equipamento
            <select required style={inputStyle} value={form.equipamento_id} onChange={(event) => atualizarCampo('equipamento_id', event.target.value)}>
              <option value="">Selecione o equipamento</option>
              {equipamentos.map((equipamento) => (
                <option key={equipamento.id} value={equipamento.id}>{equipamento.nome}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Data
            <input required type="date" style={inputStyle} value={form.data} onChange={(event) => atualizarCampo('data', event.target.value)} />
          </label>
          <label className="field-label">
            Descrição
            <textarea required style={{ ...inputStyle, minHeight: '42px', resize: 'vertical' }} value={form.descricao} onChange={(event) => atualizarCampo('descricao', event.target.value)} />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={salvando} style={primaryButtonStyle}>{salvando ? 'Salvando...' : editando ? 'Salvar' : 'Cadastrar'}</button>
            {editando && <button type="button" onClick={limparFormulario} style={secondaryButtonStyle}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className="page-panel" style={tableWrapStyle}>
        <div className="data-toolbar">
          <label className="field-label">
            Buscar
            <input style={inputStyle} placeholder="Equipamento, descrição ou data" value={busca} onChange={(event) => setBusca(event.target.value)} />
          </label>
          <label className="field-label">
            Equipamento
            <select style={inputStyle} value={equipamentoFiltro} onChange={(event) => setEquipamentoFiltro(event.target.value)}>
              <option value="Todos">Todos</option>
              {equipamentos.map((equipamento) => (
                <option key={equipamento.id} value={equipamento.id}>{equipamento.nome}</option>
              ))}
            </select>
          </label>
          <span className="result-count">{manutencoesFiltradas.length} resultado(s)</span>
        </div>

        {carregando ? (
          <p style={{ color: '#555' }}>Carregando manutenções...</p>
        ) : (
          <>
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th style={cellStyle}>Cód.</th>
                  <th style={cellStyle}>Equipamento</th>
                  <th style={cellStyle}>Descrição</th>
                  <th style={cellStyle}>Data</th>
                  <th style={cellStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {manutencoesPagina.length === 0 && (
                  <tr>
                    <td colSpan="5" style={emptyStyle}>Nenhuma manutenção encontrada.</td>
                  </tr>
                )}

                {manutencoesPagina.map((manutencao) => (
                  <tr key={manutencao.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={cellStyle}>#{manutencao.id}</td>
                    <td style={{ ...cellStyle, fontWeight: 'bold', color: 'var(--senai-blue-dark)' }}>{manutencao.equipamento}</td>
                    <td style={cellStyle}>{manutencao.descricao}</td>
                    <td style={{ ...cellStyle, color: 'var(--senai-blue)', fontWeight: '600' }}>{manutencao.data}</td>
                    <td style={{ ...cellStyle, display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => iniciarEdicao(manutencao)} style={secondaryButtonStyle}>Editar</button>
                      <button type="button" onClick={() => removerManutencao(manutencao)} style={dangerButtonStyle}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              page={pagina}
              pageSize={itensPorPagina}
              totalItems={manutencoesFiltradas.length}
              onPageChange={mudarPagina}
              onPageSizeChange={setItensPorPagina}
            />
          </>
        )}
      </section>
    </Layout>
  );
}

const headerStyle = {
  borderBottom: '1px solid var(--line)',
  paddingBottom: '15px',
  marginBottom: '25px',
};

const formStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
};

const tableWrapStyle = {
  padding: '20px',
  overflowX: 'auto',
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

const primaryButtonStyle = {
  padding: '10px 14px',
  backgroundColor: 'var(--senai-blue)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: 'var(--senai-blue-dark)',
};

const dangerButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: 'var(--senai-red)',
};

const successStyle = {
  background: '#d4edda',
  color: '#155724',
  border: '1px solid #c3e6cb',
  borderRadius: '8px',
  padding: '12px',
};

const errorStyle = {
  background: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb',
  borderRadius: '8px',
  padding: '12px',
};
