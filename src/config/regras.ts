// Pesos e parâmetros da gamificação.
// Tudo aqui é PROPOSTA EM VALIDAÇÃO (plano de ação da VP, OKR 1 · KR 1.2).

export type CodigoRegraAtividade = 'R1' | 'R2' | 'R3' | 'R4'
export type CodigoBonus = 'R5' | 'R6'
export type CodigoRegra = CodigoRegraAtividade | CodigoBonus

export interface Regra {
  codigo: CodigoRegra
  situacao: string
  pontos: number
  tipo: 'atividade' | 'bonus'
}

export const REGRAS: Record<CodigoRegra, Regra> = {
  R1: { codigo: 'R1', situacao: 'Concluída e registrada até o prazo', pontos: 3, tipo: 'atividade' },
  R2: { codigo: 'R2', situacao: 'Concluída e registrada depois do prazo', pontos: 1, tipo: 'atividade' },
  R3: {
    codigo: 'R3',
    situacao: 'Feita e não registrada (lançada pela VP no acompanhamento)',
    pontos: -2,
    tipo: 'atividade',
  },
  R4: { codigo: 'R4', situacao: 'Prazo vencido com status desatualizado', pontos: -1, tipo: 'atividade' },
  R5: { codigo: 'R5', situacao: 'Bônus: acompanhamento sem ponto de atenção', pontos: 5, tipo: 'bonus' },
  R6: { codigo: 'R6', situacao: 'Bônus: plano de ação concluído no prazo', pontos: 5, tipo: 'bonus' },
}

export const REGRAS_ATIVIDADE: CodigoRegraAtividade[] = ['R1', 'R2', 'R3', 'R4']
export const REGRAS_BONUS: CodigoBonus[] = ['R5', 'R6']

// Uma atividade vencida (R4) que for concluída e registrada agora passa a valer R2.
export const REGRA_APOS_RECUPERAR: CodigoRegraAtividade = 'R2'

// Metas dos 4 indicadores gerais (em %).
export const METAS = {
  registro: 90,
  noPrazo: 80,
  planos: 80,
  ciclo: 100,
} as const

// Semáforo: verde ≥ meta; amarelo até 10 p.p. abaixo; vermelho mais de 10 p.p. abaixo.
export const SEMAFORO = {
  toleranciaAmareloPP: 10,
  // Indicadores em nota (0 a 10): 10 p.p. equivalem a 1,0 ponto da escala.
  toleranciaAmareloNota: 1,
} as const

// Valores ILUSTRATIVOS do bônus de reconhecimento no PIPJ (dependem de aprovação da diretoria).
export const BONUS_PIPJ = {
  ilustrativo: true,
  campeao: 30,
  maisEvoluiu: 15,
} as const

export const PIPJ = {
  limitePorPedido: 300,
  categorias: ['Capacitação', 'Papelaria', 'MEJ', 'Eventos sênior', 'Tecnologia'],
} as const

export const CONFIGURACOES_PENDENTES: { titulo: string; detalhe: string; usadoNaDemo: string }[] = [
  {
    titulo: 'Bônus antes ou depois da divisão',
    detalhe: 'Os bônus R5 e R6 entram na soma antes de dividir pelo nº de atividades, ou são somados ao índice já calculado?',
    usadoNaDemo: 'Antes da divisão (como na fórmula do plano).',
  },
  {
    titulo: 'Valor do bônus no PIPJ',
    detalhe: 'Quanto o núcleo campeão e o que mais evoluiu recebem por membro na carteira PIPJ.',
    usadoNaDemo: `Ilustrativo: R$ ${BONUS_PIPJ.campeao} (campeão) e R$ ${BONUS_PIPJ.maisEvoluiu} (mais evoluiu).`,
  },
  {
    titulo: 'Participação da VP no ranking',
    detalhe: 'A Vice-Presidência concorre com os núcleos ou apenas acompanha?',
    usadoNaDemo: 'A VP participa do ranking como núcleo (Diretor – Gerente – Assessor).',
  },
  {
    titulo: 'Critério do campeão da batalha',
    detalhe: 'Campeão pela última quinzena ou pela média acumulada das quinzenas da batalha.',
    usadoNaDemo: 'Líder da quinzena atual (previsão). O acumulado usa média simples dos índices.',
  },
]
