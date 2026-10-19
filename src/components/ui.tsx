import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, Calendar, CheckCircle2, ChevronDown, Clock, Link2, Minus, User } from 'lucide-react'
import type { Atividade } from '../data/demo'
import { REGRAS } from '../config/regras'
import type { Cor } from '../lib/calculos'
import { formatarDataCurta } from '../lib/calculos'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

export function Card({
  children,
  className,
  destaque,
}: {
  children: ReactNode
  className?: string
  destaque?: boolean
}) {
  return (
    <div className={cx('card', destaque && 'border-t-[3px] border-t-highlight', className)}>{children}</div>
  )
}

export function CardHeader({ titulo, extra, acao }: { titulo: ReactNode; extra?: ReactNode; acao?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{titulo}</h2>
        {extra}
      </div>
      {acao}
    </div>
  )
}

export function Contador({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
      {children}
    </span>
  )
}

export function Pilula({
  children,
  tom = 'cinza',
  icone,
  className,
}: {
  children: ReactNode
  tom?: 'cinza' | 'verde' | 'marinho' | 'marinhoClaro' | 'ciano' | 'amarelo' | 'vermelho' | 'azul'
  icone?: ReactNode
  className?: string
}) {
  const tons = {
    cinza: 'border border-slate-200 bg-white text-slate-700',
    verde: 'bg-emerald-50 text-emerald-600',
    marinho: 'bg-navy-800 text-white',
    marinhoClaro: 'bg-navy-50 text-navy-700',
    ciano: 'bg-accent-50 text-accent-700',
    amarelo: 'bg-amber-50 text-amber-700',
    vermelho: 'bg-red-50 text-red-600',
    azul: 'bg-blue-50 text-blue-600',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold',
        tons[tom],
        className,
      )}
    >
      {icone}
      {children}
    </span>
  )
}

export function Vinculo({ children }: { children: ReactNode }) {
  return (
    <Pilula tom="marinho" icone={<Link2 className="h-3 w-3" />}>
      {children}
    </Pilula>
  )
}

export function Barra({ valor, className, escura }: { valor: number; className?: string; escura?: boolean }) {
  return (
    <div className={cx('h-2 w-full overflow-hidden rounded-full', escura ? 'bg-navy-700' : 'bg-navy-900', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-400 to-blue-500"
        style={{ width: `${Math.max(0, Math.min(100, valor))}%` }}
      />
    </div>
  )
}

export function Numero({
  valor,
  sufixo,
  rotulo,
  sub,
  icone,
  tomSub = 'ciano',
}: {
  valor: ReactNode
  sufixo?: ReactNode
  rotulo: ReactNode
  sub?: ReactNode
  icone?: ReactNode
  tomSub?: 'ciano' | 'verde' | 'cinza' | 'vermelho'
}) {
  const tons = { ciano: 'text-accent-600', verde: 'text-emerald-600', cinza: 'text-slate-400', vermelho: 'text-red-600' }
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 px-3 py-3 text-center">
      <div className="flex items-baseline gap-1.5">
        {icone && <span className="self-center">{icone}</span>}
        <span className="text-xl font-bold text-slate-900 sm:text-2xl">{valor}</span>
        {sufixo && <span className="text-sm text-slate-500">{sufixo}</span>}
      </div>
      <div className="mt-0.5 text-xs text-slate-500">{rotulo}</div>
      {sub && <div className={cx('mt-0.5 text-xs', tons[tomSub])}>{sub}</div>}
    </div>
  )
}

const coresSemaforo: Record<Cor, string> = {
  verde: 'bg-emerald-500',
  amarelo: 'bg-amber-400',
  vermelho: 'bg-red-500',
  neutro: 'bg-slate-300',
}

export function Ponto({ cor, className }: { cor: Cor; className?: string }) {
  return <span className={cx('inline-block h-2.5 w-2.5 shrink-0 rounded-full', coresSemaforo[cor], className)} />
}

export const rotuloCor: Record<Cor, string> = {
  verde: 'Verde',
  amarelo: 'Amarelo',
  vermelho: 'Vermelho',
  neutro: 'Sem dado',
}

export function Variacao({ v }: { v: number }) {
  if (v > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-accent-600">
        <ArrowUp className="h-3.5 w-3.5" />
        {v}
      </span>
    )
  if (v < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-500">
        <ArrowDown className="h-3.5 w-3.5" />
        {Math.abs(v)}
      </span>
    )
  return (
    <span className="inline-flex items-center text-xs font-semibold text-slate-400" aria-label="sem variação">
      <Minus className="h-3.5 w-3.5" />
    </span>
  )
}

export function Seletor<T extends string>({
  valor,
  opcoes,
  onChange,
  rotulo,
  className,
}: {
  valor: T
  opcoes: { valor: T; rotulo: string }[]
  onChange: (v: T) => void
  rotulo: string
  className?: string
}) {
  return (
    <label className={cx('relative inline-flex items-center', className)}>
      <span className="sr-only">{rotulo}</span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
    </label>
  )
}

export function Alternador<T extends string>({
  valor,
  opcoes,
  onChange,
}: {
  valor: T
  opcoes: { valor: T; rotulo: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          onClick={() => onChange(o.valor)}
          className={cx(
            'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
            valor === o.valor ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-50',
          )}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  )
}

// ---------- Lista no estilo das "Ações Operacionais" ----------

const statusAtividade = {
  R1: { rotulo: 'Concluído', tom: 'verde' as const },
  R2: { rotulo: 'Concluído com atraso', tom: 'azul' as const },
  R3: { rotulo: 'Não registrada · lançada pela VP', tom: 'cinza' as const },
  R4: { rotulo: 'Vencida · status desatualizado', tom: 'marinhoClaro' as const },
}

export function ItemAtividade({
  atividade,
  responsavel,
  vinculo,
  mostrarRegra = true,
  direita,
}: {
  atividade: Atividade
  responsavel: string
  vinculo?: string
  mostrarRegra?: boolean
  direita?: ReactNode
}) {
  const s = statusAtividade[atividade.regra]
  const pendente = atividade.regra === 'R4'
  const regra = REGRAS[atividade.regra]
  return (
    <li className="flex gap-3 border-b border-slate-100 px-1 py-3.5 last:border-b-0 sm:px-3">
      <div
        className={cx(
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          pendente ? 'bg-navy-50 text-navy-600' : atividade.regra === 'R3' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-500',
        )}
      >
        {pendente ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">{atividade.titulo}</p>
          <div className="flex items-center gap-2">
            <Pilula tom={s.tom}>{s.rotulo}</Pilula>
          </div>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {responsavel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatarDataCurta(atividade.prazo)}
          </span>
          <Pilula>{atividade.etiqueta}</Pilula>
          {vinculo && <Vinculo>{vinculo}</Vinculo>}
          {mostrarRegra && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <span className="font-semibold text-slate-700">{atividade.regra}</span>
              <span className={cx('font-semibold', regra.pontos > 0 ? 'text-accent-600' : 'text-slate-500')}>
                {regra.pontos > 0 ? '+' : '−'}
                {Math.abs(regra.pontos)} pts
              </span>
            </span>
          )}
          {direita}
        </div>
      </div>
    </li>
  )
}

export function Aviso({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-400">{children}</p>
}
