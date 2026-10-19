import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Award, CheckCircle2, FlaskConical, Paperclip, Plus, Wallet, X } from 'lucide-react'
import { BATALHA, MEMBROS, PIPJ_HISTORICO, type MembroId } from '../data/demo'
import { PIPJ } from '../config/regras'
import { Pilula, Seletor, cx } from '../components/ui'
import { carteiraPIPJ, fmtMoeda, formatarData, nucleoPorId } from '../lib/calculos'

// Simula outro sistema (Área do Membro): sem a barra lateral da VP, topo simples.
export function AreaDoMembro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formAberto, setFormAberto] = useState(false)
  if (!MEMBROS.some((m) => m.id === id)) return <Navigate to="/area-do-membro/joao-pedro" replace />

  const { membro, saldo, tipo, bonus, saldoPrevisto } = carteiraPIPJ(id as MembroId)
  const nucleo = nucleoPorId(membro.nucleo)

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-400 text-xs font-bold text-white">P</span>
            <span className="text-sm font-bold text-slate-900">Área do Membro</span>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden text-sm text-slate-600 sm:inline">{membro.nome}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
              {membro.iniciais}
            </span>
          </div>
        </div>
      </header>

      <main className="scroll-thin flex-1 overflow-y-auto bg-slate-50/60">
        <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/ranking" className="btn-outline">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao sistema estratégico
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-400 sm:inline">Ver como:</span>
              <Seletor<MembroId>
                rotulo="Ver como membro"
                valor={membro.id}
                onChange={(v) => navigate(`/area-do-membro/${v}`)}
                opcoes={MEMBROS.map((m) => ({ valor: m.id, rotulo: m.nome }))}
                className="w-52"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <FlaskConical className="h-3.5 w-3.5" />
            Ambiente de demonstração · dados fictícios · simula a Área do Membro (outro sistema)
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">Olá, {membro.nome.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500">
              {membro.cargo} · {nucleo.nome}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-5">
            {/* Carteira */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Wallet className="h-4 w-4 text-accent-500" />
                Carteira PIPJ
              </div>
              <div className="mt-4 text-xs text-slate-500">Saldo atual</div>
              <div className="text-4xl font-bold tracking-tight text-slate-900">{fmtMoeda(saldo)}</div>
              {bonus > 0 ? (
                <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-accent-700">+ {fmtMoeda(bonus)} bônus de reconhecimento</span>
                    <Pilula tom="ciano">Previsto</Pilula>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xs text-slate-500">Saldo previsto</span>
                    <span className="text-2xl font-bold text-accent-600">{fmtMoeda(saldoPrevisto)}</span>
                  </div>
                </div>
              ) : null}
              <button type="button" className="btn-primary mt-5" onClick={() => setFormAberto(true)}>
                <Plus className="h-4 w-4" />
                Solicitar retirada
              </button>
              <p className="mt-2 text-xs text-slate-400">
                Até {fmtMoeda(PIPJ.limitePorPedido)} por pedido, com comprovante.
              </p>
            </section>

            {/* Bônus de reconhecimento */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Award className="h-4 w-4 text-accent-500" />
                Bônus de reconhecimento
              </div>
              {tipo ? (
                <>
                  <div className="mt-4 text-2xl font-bold text-accent-600">+ {fmtMoeda(bonus)}</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {tipo === 'campeao' ? 'Núcleo campeão — previsão' : 'Núcleo que mais evoluiu — previsão'}
                  </div>
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
                    Previsto — depende do fechamento da Battle #{BATALHA.numero} e da aprovação do diretor.
                  </p>
                </>
              ) : (
                <p className="mt-4 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  Seu núcleo ainda não está na zona de reconhecimento nesta batalha.
                </p>
              )}
            </section>
          </div>

          {/* Histórico */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Histórico de lançamentos</h2>
            <div className="-mx-5 mt-3 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-2 text-left font-semibold sm:px-3">Data</th>
                    <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                    <th className="px-3 py-2 text-right font-semibold">Valor</th>
                    <th className="px-5 py-2 text-right font-semibold sm:px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tipo && (
                    <tr className="border-b border-slate-50 bg-accent-50/50">
                      <td className="px-5 py-3 text-slate-500 sm:px-3">Após {formatarData(BATALHA.fim)}</td>
                      <td className="px-3 py-3 text-slate-800">
                        Bônus de reconhecimento — Battle #{BATALHA.numero}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-accent-600">+ {fmtMoeda(bonus)}</td>
                      <td className="px-5 py-3 text-right sm:px-3">
                        <Pilula tom="ciano">Previsto</Pilula>
                      </td>
                    </tr>
                  )}
                  {[...PIPJ_HISTORICO].reverse().map((l) => (
                    <tr key={l.descricao} className="border-b border-slate-50 last:border-b-0">
                      <td className="px-5 py-3 text-slate-500 sm:px-3">{formatarData(l.data)}</td>
                      <td className="px-3 py-3 text-slate-800">{l.descricao}</td>
                      <td className={cx('px-3 py-3 text-right font-semibold', l.valor < 0 ? 'text-slate-600' : 'text-slate-900')}>
                        {l.valor < 0 ? `− ${fmtMoeda(-l.valor)}` : fmtMoeda(l.valor)}
                      </td>
                      <td className="px-5 py-3 text-right sm:px-3">
                        <Pilula tom="verde">{l.status}</Pilula>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="pb-4 text-center text-xs text-slate-400">
            Valores ilustrativos. As regras do bônus no PIPJ dependem de aprovação da diretoria.
          </p>
        </div>
      </main>

      {formAberto && <FormRetirada saldo={saldo} onFechar={() => setFormAberto(false)} />}
    </div>
  )
}

function FormRetirada({ saldo, onFechar }: { saldo: number; onFechar: () => void }) {
  const [categoria, setCategoria] = useState<string>(PIPJ.categorias[0])
  const [valor, setValor] = useState('')
  const [justificativa, setJustificativa] = useState('')
  const [arquivo, setArquivo] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const limite = Math.min(PIPJ.limitePorPedido, saldo)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const v = Number(valor.replace(',', '.'))
    if (!v || v <= 0) return setErro('Informe um valor maior que zero.')
    if (v > PIPJ.limitePorPedido) return setErro(`O limite por pedido é ${fmtMoeda(PIPJ.limitePorPedido)}.`)
    if (v > saldo) return setErro(`O valor passa do saldo atual (${fmtMoeda(saldo)}).`)
    if (justificativa.trim().length < 10) return setErro('Escreva uma justificativa curta (mín. 10 caracteres).')
    if (!arquivo) return setErro('Anexe o comprovante.')
    setErro(null)
    setEnviado(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/40 sm:items-center sm:p-4" onClick={onFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-retirada"
        className="scroll-thin max-h-full w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="titulo-retirada" className="text-base font-semibold text-slate-900">
            Solicitar retirada
          </h2>
          <button type="button" onClick={onFechar} className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {enviado ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Solicitação simulada — nenhuma operação real foi feita</p>
            <p className="mt-1 text-xs text-slate-500">
              {categoria} · {fmtMoeda(Number(valor.replace(',', '.')))}
            </p>
            <button type="button" className="btn-outline mt-5" onClick={onFechar}>
              Fechar
            </button>
          </div>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={enviar} noValidate>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Categoria</span>
              <select className="field" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {PIPJ.categorias.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Valor (até {fmtMoeda(limite)})</span>
              <input
                className="field"
                inputMode="decimal"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Justificativa</span>
              <textarea
                className="field min-h-[80px] resize-y"
                placeholder="Ex.: inscrição no curso de gestão de projetos"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Comprovante</span>
              <span className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
                <Paperclip className="h-4 w-4" />
                <span className="truncate">{arquivo ?? 'Selecionar arquivo (não é enviado)'}</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => setArquivo(e.target.files?.[0]?.name ?? null)}
                />
              </span>
            </label>
            {erro && <p className="text-xs font-medium text-slate-700">{erro}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-outline" onClick={onFechar}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Enviar solicitação
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Formulário demonstrativo. Nada é enviado ou gravado.</p>
          </form>
        )}
      </div>
    </div>
  )
}
