import { Award, Divide, ListOrdered, TrendingUp, Crown } from 'lucide-react'
import type { ReactNode } from 'react'
import { BONUS_PIPJ, CONFIGURACOES_PENDENTES, METAS, REGRAS, SEMAFORO } from '../config/regras'
import { Card, CardHeader, Pilula, Ponto, cx } from '../components/ui'
import { fmtMoeda } from '../lib/calculos'

export function Regras() {
  const regras = Object.values(REGRAS)
  return (
    <div className="space-y-5">
      <Card className="p-4 sm:p-5">
        <CardHeader titulo="Regras de pontuação" extra={<Pilula>Proposta em validação</Pilula>} />
        <div className="-mx-4 mt-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Código</th>
                <th className="px-3 py-2 text-left font-semibold">Situação</th>
                <th className="px-3 py-2 text-right font-semibold">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {regras.map((r) => (
                <tr key={r.codigo} className="border-b border-slate-50 last:border-b-0">
                  <td className="px-3 py-3">
                    <span
                      className={cx(
                        'inline-flex h-7 w-9 items-center justify-center rounded-md text-xs font-bold',
                        r.tipo === 'bonus' ? 'bg-accent-50 text-accent-700' : 'bg-navy-50 text-navy-700',
                      )}
                    >
                      {r.codigo}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{r.situacao}</td>
                  <td
                    className={cx(
                      'px-3 py-3 text-right text-base font-bold',
                      r.pontos > 0 ? 'text-accent-600' : 'text-slate-500',
                    )}
                  >
                    {r.pontos > 0 ? `+${r.pontos}` : `−${Math.abs(r.pontos)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Bloco icone={<Divide className="h-4 w-4" />} titulo="Fórmula do índice">
          <div className="rounded-lg bg-navy-800 px-4 py-3 text-sm font-medium text-white">
            Índice = (Σ pontos R1–R4 + bônus) ÷ nº de atividades da quinzena
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dividir pelo nº de atividades deixa a comparação justa entre núcleos de tamanhos diferentes.
          </p>
        </Bloco>

        <Bloco icone={<ListOrdered className="h-4 w-4" />} titulo="Desempate">
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="font-bold text-accent-600">1.</span> Maior % no prazo (R1 ÷ atividades).
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-accent-600">2.</span> Menos atrasadas (R3 + R4).
            </li>
          </ol>
        </Bloco>

        <Bloco icone={<Ponto cor="verde" />} titulo="Semáforo">
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Ponto cor="verde" /> Verde: valor ≥ meta
            </li>
            <li className="flex items-center gap-2">
              <Ponto cor="amarelo" /> Amarelo: até {SEMAFORO.toleranciaAmareloPP} p.p. abaixo da meta
            </li>
            <li className="flex items-center gap-2">
              <Ponto cor="vermelho" /> Vermelho: mais de {SEMAFORO.toleranciaAmareloPP} p.p. abaixo da meta
            </li>
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
            <span>Registro ≥ {METAS.registro}%</span>
            <span>No prazo ≥ {METAS.noPrazo}%</span>
            <span>Planos ≥ {METAS.planos}%</span>
            <span>Ciclo ≥ {METAS.ciclo}%</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Vermelho por 2 quinzenas seguidas vai para a pauta da RN.</p>
        </Bloco>

        <Bloco icone={<Award className="h-4 w-4" />} titulo="Reconhecimento na RG">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-2.5">
              <Crown className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span>
                <b>Núcleo campeão</b>: líder do ranking no fechamento da batalha. Bônus ilustrativo no PIPJ:{' '}
                {fmtMoeda(BONUS_PIPJ.campeao)} por membro.
              </span>
            </li>
            <li className="flex gap-2.5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span>
                <b>Núcleo que mais evoluiu</b>: maior aumento do índice. Bônus ilustrativo no PIPJ:{' '}
                {fmtMoeda(BONUS_PIPJ.maisEvoluiu)} por membro.
              </span>
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Registrado na ata da RG. O bônus entra no PIPJ só após a aprovação do diretor.
          </p>
        </Bloco>
      </div>

      <Card className="p-4 sm:p-5">
        <CardHeader titulo="Configurações pendentes" extra={<Pilula>{CONFIGURACOES_PENDENTES.length}</Pilula>} />
        <ul className="mt-3 divide-y divide-slate-100">
          {CONFIGURACOES_PENDENTES.map((c) => (
            <li key={c.titulo} className="grid gap-1 py-3 sm:grid-cols-[1fr_1fr] sm:gap-6">
              <div>
                <div className="text-sm font-semibold text-slate-900">{c.titulo}</div>
                <div className="text-xs text-slate-500">{c.detalhe}</div>
              </div>
              <div className="text-xs text-slate-500 sm:text-right">
                <span className="label-xs mr-1.5">Na demonstração</span>
                <span className="text-slate-700">{c.usadoNaDemo}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Bloco({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-accent-600">
        {icone}
        <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
      </div>
      {children}
    </Card>
  )
}
