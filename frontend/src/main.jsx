import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Equipamentos from './pages/Equipamentos.jsx'
import Manutencoes from './pages/Manutencoes.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Relatorios from './pages/Relatorios.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './styles.css'

const proteger = (pagina) => (
  <ProtectedRoute>
    {pagina}
  </ProtectedRoute>
)

const basename = import.meta.env.BASE_URL === '/'
  ? '/'
  : import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Rota inicial padrão joga para o Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas das páginas do sistema */}
        <Route path="/dashboard" element={proteger(<Dashboard />)} />
        <Route path="/equipamentos" element={proteger(<Equipamentos />)} />
        <Route path="/manutencoes" element={proteger(<Manutencoes />)} />
        <Route path="/agendamentos" element={proteger(<Agendamentos />)} />
        <Route path="/relatorios" element={proteger(<Relatorios />)} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
