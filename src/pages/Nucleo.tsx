import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Hash, Target, TrendingUp, CheckCircle2, RotateCcw } from 'lucide-react'
import { NUCLEOS, QUINZENA_ATUAL, type NucleoId } from '../data/demo'
import { REGRAS } from '../config/regras'
import { GraficoIndice } from '../components/GraficoIndice'
import { Card, CardHeader, Contador, ItemAtividade, Numero, Pilula, Ponto, Seletor, Variacao, cx } from '../components/ui'
import {
  atividadesParaRecuperar,
  fmtIndice,
  fmtPct,
  formatarMeta,
  formatarValor,
  indicadores,
  indiceSeRecuperar,
  membroPorId,
  membrosDoNucleo,
  rankingAtual,
  reconhecimentoDoNucleo,
} from '../lib/calculos'

export function NucleoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const nucleo = NUCLEOS.find((n) => n.id === id)
  if (!nucleo) return <Navigate to={`/nucleos/${NUCLEOS[0].id}`} replace />

  const linha = rankingAtual().find((l) => l.nucleo.id === nucleo.id)!
  const c = QUINZENA_ATUAL[nucleo.id]
  const p = linha.pontuacao
  const inds = indicadores(nucleo.id)
  const recuperar = atividadesParaRecuperar(nucleo.id)
  const membros = membrosDoNucleo(nucleo.id)
  const reconhecimento = reconhecimentoDoNucleo(nucleo.id)
  const palavras = nucleo.nome.split(/[\s-]/).filter((w) => w.length > 2)
  const iniciais = (palavras.length > 1 ? palavras.map((w) => w[0]).join('') : nucleo.nome.slice(0, 2)).toUpperCase()

  const segmentos = [
    { rotulo: 'No prazo', qtd: c.R1, cor: 'bg-accent-400', ponto: 'bg-accent-400' },
    { rotulo: 'Fora do prazo', qtd: c.R2, cor: 'bg-blue-500', ponto: 'bg-blue-500' },
    { rotulo: 'Não registradas', qtd: c.R3, cor: 'bg-slate-300', ponto: 'bg-slate-300' },
    { rotulo: 'Vencidas', qtd: c.R4, cor: 'bg-navy-900', ponto: 'bg-navy-900' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Seletor<NucleoId>
          rotulo="Selecionar núcleo"
          valor={nucleo.id}
          onChange={(v) => navigate(`/nucleos/${v}`)}
          opcoes={NUCLEOS.map((n) => ({ valor: n.id, rotulo: n.nome }))}
          className="w-full sm:w-64"
        />
        {reconhecimento && (
          <Pilula tom="ciano" icone={<TrendingUp className="h-3 w-3" />}>
            {reconhecimento === 'campeao' ? 'Zona de reconhecimento · líder' : 'Zona de reconhecimento · mais evoluiu'}
          </Pilula>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Cabeçalho no estilo do card "Vice-Presidência" */}
          <Card destaque className="p-4 sm:p-5">
            <h2 className="text-xl font-bold text-slate-900">{nucleo.nome}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-50 text-[10px] font-semibold text-slate-600">
                {iniciais}
              </span>
              {nucleo.tatico}
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{nucleo.cargos.join(' – ')}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              <Numero
                icone={<Hash className="h-4 w-4 text-accent-500" />}
                valor={`${linha.posicao}º`}
                sufixo={`/ ${NUCLEOS.length}`}
                rotulo="Posição"
                sub={
                  <span className="inline-flex items-center gap-1">
                    <Variacao v={linha.variacao} /> desde a Q3
                  </span>
                }
                tomSub="cinza"
              />
              <Numero
                icone={<Target className="h-4 w-4 text-accent-500" />}
                valor={fmtIndice(linha.indice)}
                rotulo="Índice"
                sub={`${linha.evolucao >= 0 ? '+' : '−'}${fmtIndice(Math.abs(linha.evolucao))} desde a Q3`}
                tomSub={linha.evolucao >= 0 ? 'ciano' : 'cinza'}
              />
              <Numero
                icone={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                valor={c.R1}
                sufixo={`/ ${c.atividades}`}
                rotulo="Atividades no prazo"
                sub={fmtPct(linha.noPrazoPct)}
                tomSub="verde"
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Atividades da quinzena</span>
                <span className="font-semibold text-slate-900">{c.atividades}</span>
              </div>
              <div className="mt-2 flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
                {segmentos.map((s) => (
                  <div key={s.rotulo} className={s.cor} style={{ width: `${(s.qtd / c.atividades) * 100}%` }} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {segmentos.map((s) => (
                  <span key={s.rotulo} className="inline-flex items-center gap-1.5">
                    <span className={cx('h-2 w-2 rounded-full', s.ponto)} />
                    {s.qtd} {s.rotulo}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Pontos da quinzena */}
          <Card className="p-4 sm:p-5">
            <CardHeader titulo="Pontos da quinzena" extra={<Contador>{p.total} pts</Contador>} />
            <div className="-mx-4 mt-3 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Regra</th>
                    <th className="px-3 py-2 text-right font-semibold">Qtd.</th>
                    <th className="px-3 py-2 text-right font-semibold">Peso</th>
                    <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {p.linhas.map((l) => (
                    <tr key={l.codigo} className="border-b border-slate-50">
                      <td className="px-3 py-2.5">
                        <span className="mr-2 font-semibold text-slate-900">{l.codigo}</span>
                        <span className="text-slate-500">{REGRAS[l.codigo].situacao}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-700">{l.quantidade}</td>
                      <td className="px-3 py-2.5 text-right text-slate-500">× {sinal(l.peso)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-slate-900">{sinal(l.subtotal)}</td>
                    </tr>
                  ))}
                  {p.bonus.length === 0 && (
                    <tr className="border-b border-slate-50">
                      <td className="px-3 py-2.5 text-slate-400" colSpan={4}>
                        Sem bônus R5/R6 nesta quinzena
                      </td>
                    </tr>
                  )}
                  {p.bonus.map((b) => (
                    <tr key={b.codigo} className="border-b border-slate-50">
                      <td className="px-3 py-2.5">
                        <span className="mr-2 font-semibold text-slate-900">{b.codigo}</span>
                        <span className="text-slate-500">{REGRAS[b.codigo].situacao}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-700">1</td>
                      <td className="px-3 py-2.5 text-right text-slate-500">× {sinal(b.peso)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-accent-600">{sinal(b.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-x-3 gap-y-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-500">
                ({p.pontosAtividades} + {p.pontosBonus} bônus) = <b className="text-slate-900">{p.total} pts</b>
              </span>
              <span className="text-slate-400">÷</span>
              <span className="text-slate-500">
                <b className="text-slate-900">{p.atividades}</b> atividades
              </span>
              <span className="text-slate-400">=</span>
              <span className="text-lg font-bold text-accent-600">{fmtIndice(p.indice)}</span>
            </div>
          </Card>

          {/* Para recuperar pontos */}
          <Card className="p-4 sm:p-5">
            <CardHeader
              titulo="Para recuperar pontos"
              extra={<Contador>{recuperar.length} {recuperar.length === 1 ? 'vencida' : 'vencidas'}</Contador>}
            />
            {recuperar.length === 0 ? (
              <p className="mt-4 rounded-lg bg-slate-50 py-6 text-center text-sm text-slate-500">
                Nenhuma atividade vencida com status desatualizado.
              </p>
            ) : (
              <>
                <ul className="mt-3 border-t border-slate-100">
                  {recuperar.map(({ atividade, ganho }) => (
                    <ItemAtividade
                      key={atividade.id}
                      atividade={atividade}
                      responsavel={atividade.membroId ? membroPorId(atividade.membroId).nome : 'Membro do núcleo'}
                      vinculo={nucleo.objetivo}
                      direita={
                        <span className="inline-flex items-center gap-1 font-semibold text-accent-600">
                          <RotateCcw className="h-3.5 w-3.5" />
                          vale +{ganho} pts ao atualizar
                        </span>
                      }
                    />
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-500">
                  Concluir e registrar {recuperar.length === 1 ? 'esta atividade' : 'estas atividades'} troca R4 (−1) por R2
                  (+1). Índice com tudo atualizado:{' '}
                  <b className="text-slate-900">{fmtIndice(indiceSeRecuperar(nucleo.id))}</b>.
                </p>
              </>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          {/* Semáforo */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-slate-900">Indicadores</h2>
              <Contador>{inds.filter((i) => i.cor === 'verde').length} on track</Contador>
            </div>
            <Card className="divide-y divide-slate-100">
              {inds.map((i) => (
                <div key={i.chave} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Ponto cor={i.cor} className="mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {i.nome}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{formatarValor(i)}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span>{i.chave === 'proprio' ? 'Indicador próprio' : 'Indicador geral'}</span>
                        <span>meta {formatarMeta(i)}</span>
                      </div>
                      {i.vermelhoDuasVezes && (
                        <div className="mt-1.5">
                          <Pilula tom="vermelho">Vai para a pauta da RN</Pilula>
                        </div>
                      )}
                      {i.valor === null && <div className="mt-1 text-xs text-slate-400">Sem planos com prazo nesta quinzena</div>}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Estrutura de cargos e membros da demonstração */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-slate-900">Estrutura e membros</h2>
              <Contador>{membros.length}</Contador>
            </div>
            <Card>
              <ol className="divide-y divide-slate-100">
                {nucleo.cargos.map((cargo, nivel) => {
                  const doCargo = membros.filter((m) => m.cargo === cargo)
                  return (
                    <li key={cargo} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-navy-800 text-[10px] font-bold text-white">
                          {nivel + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{cargo}</span>
                      </div>
                      {doCargo.length > 0 && (
                        <ul className="mt-2 space-y-1 pl-7">
                          {doCargo.map((m) => (
                            <li key={m.id}>
                              <Link
                                to={`/membros/${m.id}`}
                                className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                              >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-400 text-[11px] font-bold text-white">
                                  {m.iniciais}
                                </span>
                                <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{m.nome}</span>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ol>
              <p className="border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
                Apenas membros da demonstração. Não há ranking individual.
              </p>
            </Card>
          </div>

          {/* Gráfico */}
          <Card className="p-4">
            <CardHeader titulo="Índice nas quinzenas" />
            <div className="mt-2">
              <GraficoIndice nucleos={[nucleo.id]} altura={200} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function sinal(n: number) {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0'
}
