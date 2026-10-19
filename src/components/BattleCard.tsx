import type { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import { Barra, cx } from './ui'

// Card escuro no estilo dos cards de batalha do sistema estratégico.
export function BattleCard({
  etiqueta,
  quinzena,
  titulo,
  periodo,
  percentual,
  progresso,
  children,
  className,
}: {
  etiqueta: string
  quinzena?: string
  titulo: ReactNode
  periodo?: ReactNode
  percentual?: ReactNode
  progresso?: number
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 via-navy-800 to-navy-900 p-4 text-white sm:p-5',
        className,
      )}
    >
      {/* Arcos decorativos discretos, como no card original */}
      <svg
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-white/[0.06]"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="3" />
      </svg>
      <div className="relative flex items-center gap-2.5">
        <span className="rounded-md bg-accent-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-300">
          {etiqueta}
        </span>
        {quinzena && <span className="text-xs font-medium text-navy-100/80">{quinzena}</span>}
      </div>
      <div className="relative mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-tight sm:text-2xl">{titulo}</h2>
          {periodo && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-navy-100/80 sm:text-sm">
              <Calendar className="h-3.5 w-3.5" />
              {periodo}
            </p>
          )}
        </div>
        {percentual !== undefined && (
          <div className="shrink-0 text-3xl font-bold leading-none text-accent-400 sm:text-4xl">{percentual}</div>
        )}
      </div>
      {progresso !== undefined && <Barra valor={progresso} escura className="relative mt-4" />}
      {children && <div className="relative mt-4">{children}</div>}
    </div>
  )
}

export function BlocoBatalha({
  tipo,
  titulo,
  valor,
  children,
}: {
  tipo: 'PRINCIPAL' | 'SECUNDÁRIO'
  titulo: ReactNode
  valor?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="rounded-lg bg-white/[0.06] px-3 py-2.5">
      <div className="flex items-start gap-2">
        <span
          className={cx(
            'mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            tipo === 'PRINCIPAL' ? 'bg-accent-400/15 text-accent-300' : 'bg-white/10 text-navy-100',
          )}
        >
          {tipo}
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold">{titulo}</span>
        {valor && <span className="shrink-0 text-xs font-semibold text-accent-300">{valor}</span>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
