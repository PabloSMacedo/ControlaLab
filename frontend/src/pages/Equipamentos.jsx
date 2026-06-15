import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Pagination from '../components/Pagination.jsx';
import { apiService } from '../services/api';

const equipamentoInicial = {
  nome: '',
  patrimonio: '',
  localizacao: '',
  status: 'Ativo',
};

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [form, setForm] = useState(equipamentoInicial);
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busca, statusFiltro, itensPorPagina, equipamentos.length]);

  const equipamentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return equipamentos.filter((equipamento) => {
      const combinaBusca = [equipamento.nome, equipamento.patrimonio, equipamento.localizacao]
        .join(' ')
        .toLowerCase()
        .includes(termo);

      const combinaStatus = statusFiltro === 'Todos' || equipamento.status === statusFiltro;

      return combinaBusca && combinaStatus;
    });
  }, [busca, statusFiltro, equipamentos]);

  const equipamentosPagina = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return equipamentosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [equipamentosFiltrados, pagina, itensPorPagina]);

  const carregarEquipamentos = async () => {
    setCarregando(true);
    setErro('');

    try {
      const dados = await apiService.get('equipamentos/');
      setEquipamentos(dados);
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
    setForm(equipamentoInicial);
    setEditando(null);
  };

  const salvarEquipamento = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setSalvando(true);

    try {
      if (editando) {
        await apiService.put(`equipamentos/${editando}/editar/`, form);
        setMensagem('Equipamento atualizado com sucesso.');
      } else {
        await apiService.post('equipamentos/cadastrar/', form);
        setMensagem('Equipamento cadastrado com sucesso.');
      }

      limparFormulario();
      await carregarEquipamentos();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (equipamento) => {
    setEditando(equipamento.id);
    setForm({
      nome: equipamento.nome,
      patrimonio: equipamento.patrimonio,
      localizacao: equipamento.localizacao,
      status: equipamento.status,
    });
    setMensagem('');
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removerEquipamento = async (equipamento) => {
    if (!confirm(`Remover o equipamento "${equipamento.nome}"?`)) {
      return;
    }

    setMensagem('');
    setErro('');

    try {
      await apiService.delete(`equipamentos/${equipamento.id}/remover/`);
      setMensagem('Equipamento removido com sucesso.');
      await carregarEquipamentos();
    } catch (error) {
      setErro(error.message);
    }
  };

  const mudarPagina = (novaPagina) => {
    const totalPaginas = Math.max(1, Math.ceil(equipamentosFiltrados.length / itensPorPagina));
    setPagina(Math.min(Math.max(novaPagina, 1), totalPaginas));
  };

  return (
    <Layout>
      <header style={headerStyle}>
        <h1 style={{ color: 'var(--senai-blue-dark)', margin: 0 }}>💻 Gerenciamento de Equipamentos</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Consulte, adicione e gerencie os dispositivos cadastrados no laboratório.</p>
      </header>

      {mensagem && <p style={successStyle}>{mensagem}</p>}
      {erro && <p style={errorStyle}>{erro}</p>}

      <section className="page-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 className="section-heading">{editando ? 'Editar equipamento' : 'Novo equipamento'}</h2>

        <form onSubmit={salvarEquipamento} style={formStyle}>
          <label className="field-label">
            Nome
            <input required style={inputStyle} value={form.nome} onChange={(event) => atualizarCampo('nome', event.target.value)} />
          </label>
          <label className="field-label">
            Patrimônio
            <input required style={inputStyle} value={form.patrimonio} onChange={(event) => atualizarCampo('patrimonio', event.target.value)} />
          </label>
          <label className="field-label">
            Localização
            <input required style={inputStyle} value={form.localizacao} onChange={(event) => atualizarCampo('localizacao', event.target.value)} />
          </label>
          <label className="field-label">
            Status
            <select required style={inputStyle} value={form.status} onChange={(event) => atualizarCampo('status', event.target.value)}>
              <option value="Ativo">Ativo</option>
              <option value="Em manutenção">Em manutenção</option>
              <option value="Inativo">Inativo</option>
            </select>
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
            <input style={inputStyle} placeholder="Nome, patrimônio ou localização" value={busca} onChange={(event) => setBusca(event.target.value)} />
          </label>
          <label className="field-label">
            Status
            <select style={inputStyle} value={statusFiltro} onChange={(event) => setStatusFiltro(event.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Em manutenção">Em manutenção</option>
              <option value="Inativo">Inativo</option>
            </select>
          </label>
          <span className="result-count">{equipamentosFiltrados.length} resultado(s)</span>
        </div>

        {carregando ? (
          <p style={{ color: '#555' }}>Carregando equipamentos...</p>
        ) : (
          <>
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th style={cellStyle}>Nome</th>
                  <th style={cellStyle}>Patrimônio</th>
                  <th style={cellStyle}>Localização</th>
                  <th style={cellStyle}>Status</th>
                  <th style={cellStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipamentosPagina.length === 0 && (
                  <tr>
                    <td colSpan="5" style={emptyStyle}>Nenhum equipamento encontrado.</td>
                  </tr>
                )}

                {equipamentosPagina.map((equipamento) => (
                  <tr key={equipamento.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ ...cellStyle, fontWeight: 'bold', color: 'var(--senai-blue-dark)' }}>{equipamento.nome}</td>
                    <td style={cellStyle}>{equipamento.patrimonio}</td>
                    <td style={cellStyle}>{equipamento.localizacao}</td>
                    <td style={cellStyle}>
                      <span style={statusStyle(equipamento.status)}>{equipamento.status}</span>
                    </td>
                    <td style={{ ...cellStyle, display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => iniciarEdicao(equipamento)} style={secondaryButtonStyle}>Editar</button>
                      <button type="button" onClick={() => removerEquipamento(equipamento)} style={dangerButtonStyle}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              page={pagina}
              pageSize={itensPorPagina}
              totalItems={equipamentosFiltrados.length}
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
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

function statusStyle(status = '') {
  const statusNormalizado = status.toLowerCase();
  const ativo = statusNormalizado === 'ativo';
  const inativo = statusNormalizado === 'inativo';

  return {
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: ativo ? '#d4edda' : inativo ? '#e2e3e5' : '#fff3cd',
    color: ativo ? '#155724' : inativo ? '#383d41' : '#856404',
  };
}
