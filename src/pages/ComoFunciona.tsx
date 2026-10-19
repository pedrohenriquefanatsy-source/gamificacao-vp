import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Award, ClipboardList, Info, Trophy, Wallet } from 'lucide-react'
import { Fragment } from 'react'
import { Card, cx } from '../components/ui'

const ETAPAS = [
  {
    icone: ClipboardList,
    titulo: 'Monday',
    texto: 'Os membros registram as atividades.',
    para: null,
  },
  {
    icone: Trophy,
    titulo: 'Gamificação no sistema estratégico',
    texto: 'Pontos, ranking e indicadores a cada quinzena.',
    para: '/ranking',
    destaque: true,
  },
  {
    icone: Award,
    titulo: 'Reconhecimento na RG',
    texto: 'Núcleo campeão e o que mais evoluiu, registrados na ata.',
    para: '/regras',
  },
  {
    icone: Wallet,
    titulo: 'PIPJ na Área do Membro',
    texto: 'Bônus de reconhecimento no saldo, após aprovação do diretor.',
    para: '/area-do-membro/joao-pedro',
  },
]

const AVISOS = [
  'As regras de pontuação são uma proposta em validação.',
  'Os valores do PIPJ são ilustrativos.',
  'Não há ranking individual.',
]

export function ComoFunciona() {
  return (
    <div className="space-y-5">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
          {ETAPAS.map((e, i) => {
            const conteudo = (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      e.destaque ? 'bg-accent-400 text-white' : 'bg-navy-800 text-white',
                    )}
                  >
                    <e.icone className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Etapa {i + 1}</span>
                </div>
                <div className="mt-3 text-sm font-bold text-slate-900">{e.titulo}</div>
                <p className="mt-1 text-sm text-slate-500">{e.texto}</p>
              </>
            )
            const classe = cx(
              'flex-1 rounded-xl border p-4',
              e.destaque ? 'border-accent-300 bg-accent-50/50' : 'border-slate-200 bg-white',
              e.para && 'transition-colors hover:border-accent-400',
            )
            return (
              <Fragment key={e.titulo}>
                {e.para ? (
                  <Link to={e.para} className={classe}>
                    {conteudo}
                  </Link>
                ) : (
                  <div className={classe}>{conteudo}</div>
                )}
                {i < ETAPAS.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center text-slate-300">
                    <ArrowRight className="hidden h-5 w-5 lg:block" />
                    <ArrowDown className="h-5 w-5 lg:hidden" />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {AVISOS.map((a) => (
          <div key={a} className="card flex items-start gap-2.5 px-4 py-3 text-sm text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
            {a}
          </div>
        ))}
      </div>
    </div>
  )
}
