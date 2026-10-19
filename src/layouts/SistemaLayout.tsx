import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

// Casca do sistema estratégico da VP: barra lateral fixa + topo + conteúdo com rolagem própria.
export function SistemaLayout() {
  const [recolhida, setRecolhida] = useState(false)
  const [aberta, setAberta] = useState(false)
  const { pathname } = useLocation()
  const conteudo = useRef<HTMLElement>(null)

  useEffect(() => {
    conteudo.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        recolhida={recolhida}
        aberta={aberta}
        onRecolher={() => setRecolhida((v) => !v)}
        onFechar={() => setAberta(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setAberta(true)} />
        <main ref={conteudo} className="scroll-thin flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
            <div className="mb-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <FlaskConical className="h-3.5 w-3.5" />
              Ambiente de demonstração · dados fictícios
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
