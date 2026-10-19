import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, ChevronRight, Crown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { BATALHA, QUINZENAS } from '../data/demo'
import { BattleCard } from '../components/BattleCard'
import { GraficoIndice } from '../components/GraficoIndice'
import { Alternador, Card, CardHeader, Contador, Pilula, Variacao, cx } from '../components/ui'
import {
  atividadesParaRecuperar,
  destaques,
  fmtIndice,
  fmtPct,
  indicadores,
  progressoBatalha,
  periodoBatalha,
  rankingAcumulado,
  rankingAtual,
  indiceSeRecuperar,
  type LinhaRanking,
} from '../lib/calculos'

type Visao = 'quinzena' | 'acumulado'

export function Ranking() {
  const [params, setParams] = useSearchParams()
  const visao: Visao = params.get('visao') === 'acumulado' ? 'acumulado' : 'quinzena'
  const ranking = rankingAtual()
  const { lider, maisEvoluiu, atencao } = destaques()
  const numQ = QUINZENAS.findIndex((q) => q.id === BATALHA.quinzenaAtual) + 1
  const progresso = progressoBatalha()

  return (
    <div className="space-y-5">
      <BattleCard
        etiqueta={`Battle #${BATALHA.numero}`}
        quinzena={BATALHA.quinzenaAtual}
        titulo="Ranking dos núcleos"
        periodo={`${periodoBatalha()} · Quinzena ${numQ} de ${QUINZENAS.length}`}
        percentual={`${progresso}%`}
        progresso={progresso}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {QUINZENAS.map((q, i) => (
            <div key={q.id} className="text-center">
              <div
                className={cx(
                  'h-1 rounded-full',
                  i < numQ - 1 ? 'bg-accent-400/70' : i === numQ - 1 ? 'bg-accent-300' : 'bg-white/10',
                )}
              />
              <div className={cx('mt-1.5 text-[11px]', i === numQ - 1 ? 'font-semibold text-accent-300' : 'text-navy-100/60')}>
                {q.id}
              </div>
            </div>
          ))}
        </div>
      </BattleCard>

      <Podio ranking={ranking} />

      <div className="grid gap-4 md:grid-cols-3">
        <Destaque
          icone={<Crown className="h-4 w-4" />}
          rotulo="Líder da quinzena"
          nome={lider.nucleo.nome}
          id={lider.nucleo.id}
          valor={fmtIndice(lider.indice)}
          texto={`${lider.pontos} pontos em ${lider.atividades} atividades, ${fmtPct(lider.noPrazoPct)} no prazo.`}
        />
        <Destaque
          icone={<TrendingUp className="h-4 w-4" />}
          rotulo="Mais evoluiu"
          nome={maisEvoluiu.nucleo.nome}
          id={maisEvoluiu.nucleo.id}
          valor={`+${fmtIndice(maisEvoluiu.evolucao)}`}
          texto={`O índice passou de ${fmtIndice(maisEvoluiu.indiceAnterior)} para ${fmtIndice(maisEvoluiu.indice)} desde a Quinzena ${numQ - 1}.`}
        />
        <Destaque
          icone={<AlertCircle className="h-4 w-4" />}
          rotulo="Precisa de atenção"
          nome={atencao.nucleo.nome}
          id={atencao.nucleo.id}
          valor={fmtIndice(atencao.indice)}
          texto={textoAtencao(atencao)}
          suave
        />
      </div>

      <Card className="p-4 sm:p-5">
        <CardHeader
          titulo="Ranking"
          extra={<Contador>{visao === 'quinzena' ? `Quinzena ${numQ}` : `Q1 a Q${numQ}`}</Contador>}
          acao={
            <Alternador<Visao>
              valor={visao}
              onChange={(v) => setParams(v === 'acumulado' ? { visao: v } : {}, { replace: true })}
              opcoes={[
                { valor: 'quinzena', rotulo: 'Quinzena atual' },
                { valor: 'acumulado', rotulo: 'Acumulado da batalha' },
              ]}
            />
          }
        />
        <div className="mt-4">{visao === 'quinzena' ? <TabelaQuinzena linhas={ranking} /> : <TabelaAcumulado />}</div>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader titulo="Evolução do índice" extra={<Contador>Q1 a Q{numQ}</Contador>} />
        <div className="mt-4">
          <GraficoIndice />
        </div>
      </Card>
    </div>
  )
}

function textoAtencao(l: LinhaRanking) {
  const alerta = indicadores(l.nucleo.id).find((i) => i.vermelhoDuasVezes)
  const pendentes = atividadesParaRecuperar(l.nucleo.id)
  const ganho = pendentes.reduce((s, p) => s + p.ganho, 0)
  const partes: string[] = []
  if (alerta) partes.push(`${alerta.nome} em ${fmtPct(alerta.valor)} pela 2ª quinzena.`)
  if (pendentes.length)
    partes.push(
      `Atualizar ${pendentes.length === 1 ? 'a atividade vencida' : `as ${pendentes.length} atividades vencidas`} soma +${ganho} pontos e leva o índice a ${fmtIndice(indiceSeRecuperar(l.nucleo.id))}.`,
    )
  return partes.join(' ')
}

function Podio({ ranking }: { ranking: LinhaRanking[] }) {
  const navigate = useNavigate()
  const ordem = [ranking[1], ranking[0], ranking[2]]
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
      {ordem.map((l) => {
        const primeiro = l.posicao === 1
        return (
          <button
            key={l.nucleo.id}
            type="button"
            onClick={() => navigate(`/nucleos/${l.nucleo.id}`)}
            className={cx(
              'card group flex flex-col items-center px-2 text-center transition-colors hover:border-accent-300 sm:px-4',
              primeiro ? 'border-t-[3px] border-t-accent-400 pb-6 pt-5 sm:pb-8' : 'pb-4 pt-4',
            )}
          >
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                primeiro ? 'bg-accent-400 text-white' : 'bg-navy-800 text-white',
              )}
            >
              {l.posicao}º
            </span>
            <span className="mt-2 text-xs font-semibold text-slate-700 sm:text-sm">{l.nucleo.nome}</span>
            <span className={cx('mt-1 font-bold text-slate-900', primeiro ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl')}>
              {fmtIndice(l.indice)}
            </span>
            <span className="mt-0.5 text-[11px] text-slate-500">índice · {l.pontos} pts</span>
          </button>
        )
      })}
    </div>
  )
}

function Destaque({
  icone,
  rotulo,
  nome,
  id,
  valor,
  texto,
  suave,
}: {
  icone: ReactNode
  rotulo: string
  nome: string
  id: string
  valor: string
  texto: string
  suave?: boolean
}) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(`/nucleos/${id}`)}
      className="card flex flex-col p-4 text-left transition-colors hover:border-accent-300"
    >
      <div className="flex items-center justify-between">
        <span
          className={cx(
            'inline-flex items-center gap-1.5 text-xs font-semibold',
            suave ? 'text-slate-500' : 'text-accent-600',
          )}
        >
          {icone}
          {rotulo}
        </span>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold text-slate-900">{nome}</span>
        <span className={cx('text-lg font-bold', suave ? 'text-slate-700' : 'text-accent-600')}>{valor}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{texto}</p>
    </button>
  )
}

const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400'
const td = 'px-3 py-3 text-sm'

function TabelaQuinzena({ linhas }: { linhas: LinhaRanking[] }) {
  const navigate = useNavigate()
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[620px]">
        <thead className="border-b border-slate-100">
          <tr>
            <th className={th}>Pos.</th>
            <th className={th}>Var.</th>
            <th className={th}>Núcleo</th>
            <th className={cx(th, 'text-right')}>Índice</th>
            <th className={cx(th, 'text-right')}>Pontos</th>
            <th className={cx(th, 'text-right')}>Atividades</th>
            <th className={cx(th, 'text-right')}>No prazo</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr
              key={l.nucleo.id}
              onClick={() => navigate(`/nucleos/${l.nucleo.id}`)}
              className="cursor-pointer border-b border-slate-50 transition-colors last:border-b-0 hover:bg-slate-50"
            >
              <td className={cx(td, 'font-bold text-slate-900')}>{l.posicao}º</td>
              <td className={td}>
                <Variacao v={l.variacao} />
              </td>
              <td className={td}>
                <div className="font-semibold text-slate-900">{l.nucleo.nome}</div>
                <div className="text-xs text-slate-500">{l.nucleo.tatico}</div>
              </td>
              <td className={cx(td, 'text-right text-base font-bold text-slate-900')}>{fmtIndice(l.indice)}</td>
              <td className={cx(td, 'text-right text-slate-700')}>{l.pontos}</td>
              <td className={cx(td, 'text-right text-slate-700')}>{l.atividades}</td>
              <td className={cx(td, 'text-right text-slate-700')}>{fmtPct(l.noPrazoPct)}</td>
              <td className="pr-3 text-slate-300">
                <ChevronRight className="h-4 w-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 px-4 text-xs text-slate-400 sm:px-0">
        Índice = pontos ÷ atividades. Desempate: maior % no prazo, depois menos atrasadas. Variação em relação à quinzena anterior.
      </p>
    </div>
  )
}

function TabelaAcumulado() {
  const navigate = useNavigate()
  const linhas = rankingAcumulado()
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[620px]">
        <thead className="border-b border-slate-100">
          <tr>
            <th className={th}>Pos.</th>
            <th className={th}>Var.</th>
            <th className={th}>Núcleo</th>
            {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
              <th key={q} className={cx(th, 'text-right')}>
                {q}
              </th>
            ))}
            <th className={cx(th, 'text-right')}>Média</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr
              key={l.nucleo.id}
              onClick={() => navigate(`/nucleos/${l.nucleo.id}`)}
              className="cursor-pointer border-b border-slate-50 transition-colors last:border-b-0 hover:bg-slate-50"
            >
              <td className={cx(td, 'font-bold text-slate-900')}>{l.posicao}º</td>
              <td className={td}>
                <Variacao v={l.variacao} />
              </td>
              <td className={cx(td, 'font-semibold text-slate-900')}>{l.nucleo.nome}</td>
              {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                <td key={q} className={cx(td, 'text-right text-slate-600')}>
                  {fmtIndice(l.porQuinzena[q])}
                </td>
              ))}
              <td className={cx(td, 'text-right text-base font-bold text-slate-900')}>{fmtIndice(l.media)}</td>
              <td className="pr-3 text-slate-300">
                <ChevronRight className="h-4 w-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex flex-wrap items-center gap-2 px-4 text-xs text-slate-400 sm:px-0">
        <Pilula>Configuração pendente</Pilula>
        Acumulado calculado como média simples dos índices das quinzenas. Variação em relação à média até a Q3.
      </p>
    </div>
  )
}
