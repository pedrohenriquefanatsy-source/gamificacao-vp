import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Home, LogOut, Menu, Search } from 'lucide-react'
import { MEMBROS, NUCLEOS } from '../data/demo'
import { cx } from '../components/ui'
import { ITENS_GAMIFICACAO, TITULOS } from './navegacao'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()
  const base = '/' + (pathname.split('/')[1] ?? '')
  const titulo = TITULOS[base] ?? 'Gamificação'
  const [buscaAberta, setBuscaAberta] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setBuscaAberta((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Gamificação</span>
          <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
          <span className="truncate font-medium text-slate-800">{titulo}</span>
        </nav>
        <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{titulo}</h1>
      </div>
      <button
        type="button"
        onClick={() => setBuscaAberta(true)}
        className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 md:flex"
      >
        <Search className="h-4 w-4" />
        <span className="pr-6">Buscar...</span>
        <kbd className="rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-500">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={() => setBuscaAberta(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
        aria-label="Buscar"
      >
        <Search className="h-4 w-4" />
      </button>
      <span
        title="Fora da demonstração"
        className="hidden h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 text-slate-500 sm:flex"
      >
        <Bell className="h-4 w-4" />
      </span>
      <span
        title="Fora da demonstração"
        className="hidden h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 text-slate-500 sm:flex"
      >
        <LogOut className="h-4 w-4" />
      </span>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-400 text-xs font-bold text-white">
        DE
      </div>
      {buscaAberta && <Busca onFechar={() => setBuscaAberta(false)} />}
    </header>
  )
}

function Busca({ onFechar }: { onFechar: () => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const navigate = useNavigate()
  const input = useRef<HTMLInputElement>(null)

  const itens = useMemo(
    () => [
      ...ITENS_GAMIFICACAO.map((i) => ({ rotulo: i.rotulo, grupo: 'Telas', para: i.para! })),
      ...NUCLEOS.map((n) => ({ rotulo: n.nome, grupo: 'Núcleos', para: `/nucleos/${n.id}` })),
      ...MEMBROS.map((m) => ({ rotulo: m.nome, grupo: 'Membros', para: `/membros/${m.id}` })),
    ],
    [],
  )
  const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const filtrados = itens.filter((i) => norm(i.rotulo).includes(norm(q)))

  useEffect(() => input.current?.focus(), [])

  const ir = (para: string) => {
    navigate(para)
    onFechar()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy-950/40 px-4 pt-[12vh]" onClick={onFechar}>
      <div className="card w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onFechar()
              if (e.key === 'ArrowDown') setSel((s) => Math.min(s + 1, filtrados.length - 1))
              if (e.key === 'ArrowUp') setSel((s) => Math.max(s - 1, 0))
              if (e.key === 'Enter' && filtrados[sel]) ir(filtrados[sel].para)
            }}
            placeholder="Buscar telas, núcleos ou membros..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <ul className="scroll-thin max-h-80 overflow-y-auto py-2">
          {filtrados.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">Nada encontrado.</li>}
          {filtrados.map((i, idx) => (
            <li key={i.grupo + i.rotulo}>
              <Link
                to={i.para}
                onClick={onFechar}
                onMouseEnter={() => setSel(idx)}
                className={cx(
                  'flex items-center justify-between px-4 py-2 text-sm',
                  idx === sel ? 'bg-accent-50 text-slate-900' : 'text-slate-700',
                )}
              >
                {i.rotulo}
                <span className="text-xs text-slate-400">{i.grupo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
