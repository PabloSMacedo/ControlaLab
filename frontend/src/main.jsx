import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Equipamentos from './pages/Equipamentos.jsx'
import Manutencoes from './pages/Manutencoes.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Relatorios from './pages/Relatorios.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota inicial padrão joga para o Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas das páginas do sistema */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipamentos" element={<Equipamentos />} />
        <Route path="/manutencoes" element={<Manutencoes />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)