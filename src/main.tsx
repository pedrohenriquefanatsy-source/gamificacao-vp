import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { SistemaLayout } from './layouts/SistemaLayout'
import { ComoFunciona } from './pages/ComoFunciona'
import { Ranking } from './pages/Ranking'
import { NucleoPage } from './pages/Nucleo'
import { MembroPage } from './pages/Membro'
import { Indicadores } from './pages/Indicadores'
import { Regras } from './pages/Regras'
import { AreaDoMembro } from './pages/AreaDoMembro'

// HashRouter: as rotas funcionam dentro do iframe do Google Sites e ao recarregar a página.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<SistemaLayout />}>
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/nucleos" element={<Navigate to="/nucleos/cs" replace />} />
          <Route path="/nucleos/:id" element={<NucleoPage />} />
          <Route path="/membros" element={<Navigate to="/membros/joao-pedro" replace />} />
          <Route path="/membros/:id" element={<MembroPage />} />
          <Route path="/indicadores" element={<Indicadores />} />
          <Route path="/regras" element={<Regras />} />
        </Route>
        <Route path="/area-do-membro" element={<Navigate to="/area-do-membro/joao-pedro" replace />} />
        <Route path="/area-do-membro/:id" element={<AreaDoMembro />} />
        <Route path="*" element={<Navigate to="/ranking" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
