import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Award, CalendarCheck, CalendarClock, ClipboardList, Clock } from 'lucide-react'
import { BATALHA, MEMBROS, QUINZENAS, type MembroId } from '../data/demo'
import { BONUS_PIPJ } from '../config/regras'
import { Card, CardHeader, Contador, ItemAtividade, Numero, Pilula, Seletor } from '../components/ui'
import { fmtMoeda, nucleoPorId, reconhecimentoDoNucleo, resumoMembro } from '../lib/calculos'

export function MembroPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  if (!MEMBROS.some((m) => m.id === id)) return <Navigate to="/membros/joao-pedro" replace />

  const { membro, lista, contagem, pontos, pontosNucleo } = resumoMembro(id as MembroId)
  const nucleo = nucleoPorId(membro.nucleo)
  const reconhecimento = reconhecimentoDoNucleo(membro.nucleo)
  const restantes = QUINZENAS.length - (QUINZENAS.findIndex((q) => q.id === BATALHA.quinzenaAtual) + 1)
  const participacao = Math.round((Math.max(pontos, 0) / pontosNucleo) * 100)

  return (
    <div className="space-y-5">
      <Seletor<MembroId>
        rotulo="Selecionar membro"
        valor={membro.id}
        onChange={(v) => navigate(`/membros/${v}`)}
        opcoes={MEMBROS.map((m) => ({ valor: m.id, rotulo: `${m.nome} · ${m.cargo} · ${nucleoPorId(m.nucleo).nome}` }))}
        className="w-full sm:w-80"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card destaque className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-400 text-base font-bold text-white">
                {membro.iniciais}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{membro.nome}</h2>
                <p className="text-sm text-slate-500">
                  {membro.cargo} ·{' '}
                  <Link to={`/nucleos/${nucleo.id}`} className="font-medium text-accent-600 hover:underline">
                    {nucleo.nome}
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <Numero
                icone={<ClipboardList className="h-4 w-4 text-accent-500" />}
                valor={contagem.atividades}
                rotulo="Atividades na quinzena"
                sub={contagem.R3 ? `${contagem.R3} lançada pela VP` : undefined}
                tomSub="cinza"
              />
              <Numero
                icone={<CalendarCheck className="h-4 w-4 text-emerald-500" />}
                valor={contagem.R1}
                rotulo="Concluídas no prazo"
              />
              <Numero icone={<CalendarClock className="h-4 w-4 text-blue-500" />} valor={contagem.R2} rotulo="Fora do prazo" />
              <Numero icone={<Clock className="h-4 w-4 text-navy-500" />} valor={contagem.R4} rotulo="Pendentes / vencidas" />
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader titulo="Minhas atividades" extra={<Contador>Quinzena 4</Contador>} />
            <ul className="mt-3 border-t border-slate-100">
              {lista.map((a) => (
                <ItemAtividade key={a.id} atividade={a} responsavel={membro.nome} vinculo={nucleo.objetivo} />
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <h2 className="text-base font-semibold text-slate-900">Contribuição para o núcleo</h2>
            <p className="mt-3 text-sm text-slate-600">
              Suas atividades somaram <b className="text-slate-900">{pontos}</b> dos{' '}
              <b className="text-slate-900">{pontosNucleo}</b> pontos do núcleo {nucleo.nome}.
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-navy-900">
              <div className="h-full rounded-full bg-gradient-to-r from-accent-400 to-blue-500" style={{ width: `${participacao}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Os pontos contam para o núcleo. Não há posição individual nem comparação entre membros.
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent-500" />
              <h2 className="text-base font-semibold text-slate-900">Reconhecimento</h2>
            </div>
            {reconhecimento ? (
              <>
                <div className="mt-3">
                  <Pilula tom="ciano">
                    {reconhecimento === 'campeao' ? 'Núcleo campeão — previsão' : 'Núcleo que mais evoluiu — previsão'}
                  </Pilula>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {nucleo.nome} está na zona de reconhecimento da Battle #{BATALHA.numero}. O bônus previsto no PIPJ é de{' '}
                  <b className="text-accent-600">
                    {fmtMoeda(reconhecimento === 'campeao' ? BONUS_PIPJ.campeao : BONUS_PIPJ.maisEvoluiu)}
                  </b>
                  , após o fechamento da batalha e a aprovação do diretor.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                {nucleo.nome} ainda não está na zona de reconhecimento nesta batalha. Ainda há {restantes} quinzenas na batalha para o núcleo subir.
              </p>
            )}
            <Link to={`/area-do-membro/${membro.id}`} className="btn-outline mt-4 w-full">
              Ver na Área do Membro · PIPJ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
