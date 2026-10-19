import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Info } from 'lucide-react'
import { BATALHA, NUCLEOS, type NucleoId } from '../data/demo'
import { Card, CardHeader, Contador, Pilula, Ponto, cx, rotuloCor } from '../components/ui'
import {
  NOMES_INDICADORES,
  formatarMeta,
  formatarValor,
  indicadores,
  pontosDeAtencaoRN,
  type ChaveIndicador,
} from '../lib/calculos'
import { SEMAFORO } from '../config/regras'

const COLUNAS: ChaveIndicador[] = ['registro', 'noPrazo', 'planos', 'ciclo', 'proprio']

export function Indicadores() {
  const [sel, setSel] = useState<{ nucleo: NucleoId; chave: ChaveIndicador }>({ nucleo: 'marketing', chave: 'noPrazo' })
  const [copia, setCopia] = useState<'idle' | 'ok' | 'manual'>('idle')
  const texto = pontosDeAtencaoRN()

  const linhas = NUCLEOS.map((n) => ({ nucleo: n, inds: indicadores(n.id) }))
  const detalhe = linhas.find((l) => l.nucleo.id === sel.nucleo)!
  const ind = detalhe.inds.find((i) => i.chave === sel.chave)!
  const totalAlertas = linhas.reduce((s, l) => s + l.inds.filter((i) => i.vermelhoDuasVezes).length, 0)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopia('ok')
    } catch {
      // Dentro de um iframe a API de área de transferência pode estar bloqueada: tenta o método antigo.
      const area = document.createElement('textarea')
      area.value = texto
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      setCopia(ok ? 'ok' : 'manual')
    }
    window.setTimeout(() => setCopia((c) => (c === 'ok' ? 'idle' : c)), 2500)
  }

  return (
    <div className="space-y-5">
      <Card className="p-4 sm:p-5">
        <CardHeader
          titulo="Matriz de indicadores"
          extra={<Contador>Quinzena 4 · Battle #{BATALHA.numero}</Contador>}
          acao={
            <button type="button" className="btn-primary" onClick={copiar}>
              {copia === 'ok' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copia === 'ok' ? 'Copiado' : 'Copiar pontos de atenção para a RN'}
            </button>
          }
        />
        <div className="-mx-4 mt-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-100 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Núcleo
                </th>
                {COLUNAS.map((c) => (
                  <th
                    key={c}
                    className="border-b border-slate-100 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {NOMES_INDICADORES[c]}
                  </th>
                ))}
                <th className="border-b border-slate-100 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Alertas
                </th>
              </tr>
            </thead>
            <tbody>
              {linhas.map(({ nucleo, inds }) => {
                const alertas = inds.filter((i) => i.vermelhoDuasVezes)
                return (
                  <tr key={nucleo.id}>
                    <td className="border-b border-slate-50 px-3 py-2">
                      <Link to={`/nucleos/${nucleo.id}`} className="font-semibold text-slate-900 hover:text-accent-600">
                        {nucleo.nome}
                      </Link>
                    </td>
                    {inds.map((i) => {
                      const ativo = sel.nucleo === nucleo.id && sel.chave === i.chave
                      return (
                        <td key={i.chave} className="border-b border-slate-50 px-1 py-1.5">
                          <button
                            type="button"
                            onClick={() => setSel({ nucleo: nucleo.id, chave: i.chave })}
                            className={cx(
                              'flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors',
                              ativo ? 'border-accent-400 bg-accent-50/60' : 'border-transparent hover:bg-slate-50',
                            )}
                            aria-label={`${nucleo.nome} · ${i.nome}: ${formatarValor(i)}, ${rotuloCor[i.cor]}`}
                          >
                            <Ponto cor={i.cor} />
                            <span className="min-w-0">
                              <span className="block font-semibold text-slate-900">{formatarValor(i)}</span>
                              {i.chave === 'proprio' && (
                                <span className="block truncate text-[11px] text-slate-500">{i.nome}</span>
                              )}
                            </span>
                          </button>
                        </td>
                      )
                    })}
                    <td className="border-b border-slate-50 px-3 py-2">
                      {alertas.length ? (
                        <div className="flex flex-col gap-1">
                          {alertas.map((a) => (
                            <Pilula key={a.chave} tom="vermelho">
                              {NOMES_INDICADORES[a.chave]}: vermelho 2× → pauta da RN
                            </Pilula>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Ponto cor="verde" /> Verde: na meta ou acima
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ponto cor="amarelo" /> Amarelo: até {SEMAFORO.toleranciaAmareloPP} p.p. abaixo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ponto cor="vermelho" /> Vermelho: mais de {SEMAFORO.toleranciaAmareloPP} p.p. abaixo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ponto cor="neutro" /> Sem dado
          </span>
          <span className="ml-auto">{totalAlertas} alerta(s) para a pauta da RN</span>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">{detalhe.nucleo.nome}</div>
              <h2 className="text-lg font-semibold text-slate-900">{ind.nome}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Ponto cor={ind.cor} />
              <span className="text-sm font-semibold text-slate-700">{rotuloCor[ind.cor]}</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
            <div className="label-xs">Fórmula</div>
            <div className="mt-1 text-sm font-medium text-slate-800">{ind.nome} = {ind.formula}</div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {ind.tipo === 'percentual' && ind.denominador !== undefined ? (
              <>
                <Dado rotulo="Numerador" valor={ind.numerador} sub={ind.rotuloNumerador} />
                <Dado rotulo="Denominador" valor={ind.denominador} sub={ind.rotuloDenominador} />
              </>
            ) : (
              <>
                <Dado rotulo="Medida" valor="Nota" sub="escala de 0 a 10" />
                <Dado rotulo="Amostra" valor="—" sub="média informada pelo núcleo" />
              </>
            )}
            <Dado rotulo="Resultado" valor={formatarValor(ind)} />
            <Dado rotulo="Meta" valor={formatarMeta(ind)} />
          </dl>
          {ind.chave === 'noPrazo' && ind.corAnterior && (
            <p className="mt-4 text-xs text-slate-500">
              Na quinzena anterior: <b>{rotuloCor[ind.corAnterior].toLowerCase()}</b>.{' '}
              {ind.vermelhoDuasVezes && 'Vermelho pela 2ª quinzena seguida: vai para a pauta da RN.'}
            </p>
          )}
          {ind.valor === null && (
            <p className="mt-4 text-xs text-slate-500">Sem planos de ação com prazo nesta quinzena; o indicador não entra no semáforo.</p>
          )}
          {ind.tipo === 'nota' && (
            <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-500">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" />
              Para notas, a faixa amarela é de até {SEMAFORO.toleranciaAmareloNota.toLocaleString('pt-BR')} ponto abaixo da meta.
            </p>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader titulo="Texto para a RN" extra={<Contador>prévia</Contador>} />
          <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 px-4 py-3 font-sans text-xs leading-relaxed text-slate-700">
            {texto}
          </pre>
          {copia === 'manual' && (
            <p className="mt-2 text-xs text-slate-500">
              O navegador bloqueou a cópia automática dentro da página incorporada. Selecione o texto acima e copie.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            No protótipo, o botão só copia o texto para a área de transferência.
          </p>
        </Card>
      </div>
    </div>
  )
}

function Dado({ rotulo, valor, sub }: { rotulo: string; valor: ReactNode; sub?: string }) {
  return (
    <div>
      <dt className="label-xs">{rotulo}</dt>
      <dd className="mt-0.5 text-lg font-bold text-slate-900">{valor}</dd>
      {sub && <dd className="text-[11px] leading-snug text-slate-500">{sub}</dd>}
    </div>
  )
}
