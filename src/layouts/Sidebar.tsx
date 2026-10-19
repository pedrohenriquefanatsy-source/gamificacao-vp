import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, X } from 'lucide-react'
import { cx } from '../components/ui'
import { ITENS_GAMIFICACAO, ITENS_SISTEMA } from './navegacao'

const DICA_SISTEMA = 'Parte do sistema atual — fora da demonstração'

export function Sidebar({
  recolhida,
  aberta,
  onRecolher,
  onFechar,
}: {
  recolhida: boolean
  aberta: boolean
  onRecolher: () => void
  onFechar: () => void
}) {
  const { pathname } = useLocation()

  return (
    <>
      {/* Fundo escurecido do menu no celular/tablet */}
      <div
        className={cx(
          'fixed inset-0 z-30 bg-navy-950/50 transition-opacity lg:hidden',
          aberta ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onFechar}
        aria-hidden
      />
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-navy-900 to-navy-800 text-navy-100 transition-transform lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]',
          aberta ? 'translate-x-0' : '-translate-x-full',
          recolhida ? 'lg:w-[72px]' : 'lg:w-64',
        )}
        aria-label="Navegação principal"
      >
        {/* Logotipo */}
        <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/[0.06] px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-base font-bold text-white">
            P
          </div>
          <div className={cx('min-w-0 flex-1 leading-tight', recolhida && 'lg:hidden')}>
            <div className="text-[15px] font-bold tracking-wide text-white">PRODUTIVA</div>
            <div className="text-[10px] font-semibold tracking-[0.18em] text-accent-400">JUNIOR</div>
          </div>
          <button
            type="button"
            onClick={onRecolher}
            className={cx(
              'hidden h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-navy-100 hover:bg-white/10 lg:flex',
              recolhida && 'lg:hidden',
            )}
            aria-label="Recolher barra lateral"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-navy-100 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {recolhida && (
          <button
            type="button"
            onClick={onRecolher}
            className="mx-auto mt-3 hidden h-7 w-7 rotate-180 items-center justify-center rounded-md bg-white/[0.06] text-navy-100 hover:bg-white/10 lg:flex"
            aria-label="Expandir barra lateral"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <nav className="scroll-thin-dark flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {ITENS_SISTEMA.map((item) => (
              <li key={item.rotulo}>
                <span
                  title={DICA_SISTEMA}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-100/40"
                >
                  <item.icone className="h-[18px] w-[18px] shrink-0" />
                  <span className={cx('truncate', recolhida && 'lg:hidden')}>{item.rotulo}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className={cx('mb-2 mt-5 px-3', recolhida && 'lg:px-0 lg:text-center')}>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-400">
              {recolhida ? <span className="hidden lg:inline">•••</span> : null}
              <span className={cx(recolhida && 'lg:hidden')}>Gamificação</span>
            </span>
          </div>
          <ul className="space-y-0.5">
            {ITENS_GAMIFICACAO.map((item) => {
              const ativo = item.base ? pathname.startsWith(item.base) : false
              return (
                <li key={item.rotulo}>
                  <Link
                    to={item.para!}
                    onClick={onFechar}
                    title={recolhida ? item.rotulo : undefined}
                    className={cx(
                      'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      ativo
                        ? 'border-accent-400/70 bg-navy-700 text-white'
                        : 'border-transparent text-navy-100 hover:bg-white/[0.05] hover:text-white',
                    )}
                  >
                    <item.icone className={cx('h-[18px] w-[18px] shrink-0', ativo && 'text-accent-300')} />
                    <span className={cx('min-w-0 flex-1 leading-tight', recolhida && 'lg:hidden')}>
                      <span className="block truncate">{item.rotulo}</span>
                      {item.outroSistema && (
                        <span className="mt-1 inline-block rounded border border-white/15 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-navy-100/70">
                          outro sistema
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Rodapé */}
        <div className="flex shrink-0 items-center gap-3 border-t border-white/[0.06] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-400 text-xs font-bold text-white">
            PJ
          </div>
          <div className={cx('min-w-0 leading-tight', recolhida && 'lg:hidden')}>
            <div className="truncate text-sm font-semibold text-white">Produtiva Junior</div>
            <div className="truncate text-xs text-navy-100/60">Diretor · Produtiva Júnior</div>
          </div>
        </div>
      </aside>
    </>
  )
}
