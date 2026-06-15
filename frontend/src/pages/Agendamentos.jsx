import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Pagination from '../components/Pagination.jsx';
import { apiService, obterSessao } from '../services/api';

const agendamentoInicial = {
  equipamento_id: '',
  data: '',
};

export default function Agendamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [form, setForm] = useState(agendamentoInicial);
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [equipamentoFiltro, setEquipamentoFiltro] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  const sessao = obterSessao();
  const usuarioId = sessao?.usuario?.id;

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busca, equipamentoFiltro, itensPorPagina, agendamentos.length]);

  const agendamentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return agendamentos.filter((agendamento) => {
      const combinaBusca = [agendamento.usuario, agendamento.equipamento, agendamento.data]
        .join(' ')
        .toLowerCase()
        .includes(termo);

      const combinaEquipamento = equipamentoFiltro === 'Todos' || String(agendamento.equipamento_id) === equipamentoFiltro;

      return combinaBusca && combinaEquipamento;
    });
  }, [busca, equipamentoFiltro, agendamentos]);

  const agendamentosPagina = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return agendamentosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [agendamentosFiltrados, pagina, itensPorPagina]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');

    try {
      const [listaEquipamentos, listaAgendamentos] = await Promise.all([
        apiService.get('equipamentos/'),
        apiService.get('agendamentos/'),
      ]);

      setEquipamentos(listaEquipamentos);
      setAgendamentos(listaAgendamentos);
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
    setForm(agendamentoInicial);
    setEditando(null);
  };

  const payload = () => ({
    usuario_id: usuarioId,
    equipamento_id: form.equipamento_id,
    data: form.data,
  });

  const salvarAgendamento = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');

    if (!usuarioId) {
      setErro('Usuário da sessão não encontrado. Faça login novamente.');
      return;
    }

    setSalvando(true);

    try {
      if (editando) {
        await apiService.put(`agendamentos/${editando}/editar/`, payload());
        setMensagem('Agendamento atualizado com sucesso.');
      } else {
        await apiService.post('agendamentos/cadastrar/', payload());
        setMensagem('Agendamento cadastrado com sucesso.');
      }

      limparFormulario();
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (agendamento) => {
    setEditando(agendamento.id);
    setForm({
      equipamento_id: String(agendamento.equipamento_id),
      data: agendamento.data,
    });
    setMensagem('');
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removerAgendamento = async (agendamento) => {
    if (!confirm(`Remover o agendamento #${agendamento.id}?`)) {
      return;
    }

    setMensagem('');
    setErro('');

    try {
      await apiService.delete(`agendamentos/${agendamento.id}/remover/`);
      setMensagem('Agendamento removido com sucesso.');
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  };

  const mudarPagina = (novaPagina) => {
    const totalPaginas = Math.max(1, Math.ceil(agendamentosFiltrados.length / itensPorPagina));
    setPagina(Math.min(Math.max(novaPagina, 1), totalPaginas));
  };

  return (
    <Layout>
      <header style={headerStyle}>
        <h1 style={{ color: 'var(--senai-blue-dark)', margin: 0 }}>📅 Agendamentos de Equipamentos</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Gerencie as reservas para utilização dos recursos laboratoriais.</p>
      </header>

      {mensagem && <p style={successStyle}>{mensagem}</p>}
      {erro && <p style={errorStyle}>{erro}</p>}

      <section className="page-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 className="section-heading">{editando ? 'Editar agendamento' : 'Novo agendamento'}</h2>

        <form onSubmit={salvarAgendamento} style={formStyle}>
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
            <input style={inputStyle} placeholder="Usuário, equipamento ou data" value={busca} onChange={(event) => setBusca(event.target.value)} />
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
          <span className="result-count">{agendamentosFiltrados.length} resultado(s)</span>
        </div>

        {carregando ? (
          <p style={{ color: '#555' }}>Carregando agendamentos...</p>
        ) : (
          <>
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Usuário</th>
                  <th style={cellStyle}>Equipamento</th>
                  <th style={cellStyle}>Data</th>
                  <th style={cellStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosPagina.length === 0 && (
                  <tr>
                    <td colSpan="5" style={emptyStyle}>Nenhum agendamento encontrado.</td>
                  </tr>
                )}

                {agendamentosPagina.map((agendamento) => (
                  <tr key={agendamento.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={cellStyle}>#{agendamento.id}</td>
                    <td style={{ ...cellStyle, fontWeight: 'bold', color: 'var(--senai-blue-dark)' }}>{agendamento.usuario}</td>
                    <td style={cellStyle}>{agendamento.equipamento}</td>
                    <td style={{ ...cellStyle, color: 'var(--senai-blue)', fontWeight: '600' }}>{agendamento.data}</td>
                    <td style={{ ...cellStyle, display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => iniciarEdicao(agendamento)} style={secondaryButtonStyle}>Editar</button>
                      <button type="button" onClick={() => removerAgendamento(agendamento)} style={dangerButtonStyle}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              page={pagina}
              pageSize={itensPorPagina}
              totalItems={agendamentosFiltrados.length}
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
