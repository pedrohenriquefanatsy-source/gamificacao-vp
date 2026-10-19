// Dados demonstrativos (fictícios). Todos os números das telas são calculados a partir daqui
// com as funções de src/lib/calculos.ts e os pesos de src/config/regras.ts.

import type { CodigoBonus, CodigoRegraAtividade } from '../config/regras'

export type NucleoId = 'presidencia' | 'vp' | 'projetos' | 'marketing' | 'gp'
export type QuinzenaId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6'

export const BATALHA = {
  numero: 3,
  titulo: 'Acompanhamento dos núcleos',
  inicio: '2026-09-01',
  fim: '2026-11-30',
  quinzenaAtual: 'Q4' as QuinzenaId,
  // Data usada como "hoje" na demonstração (fim da Quinzena 4).
  dataReferencia: '2026-10-30',
}

export const QUINZENAS: { id: QuinzenaId; inicio: string; fim: string }[] = [
  { id: 'Q1', inicio: '2026-09-01', fim: '2026-09-15' },
  { id: 'Q2', inicio: '2026-09-16', fim: '2026-09-30' },
  { id: 'Q3', inicio: '2026-10-01', fim: '2026-10-15' },
  { id: 'Q4', inicio: '2026-10-16', fim: '2026-10-31' },
  { id: 'Q5', inicio: '2026-11-01', fim: '2026-11-15' },
  { id: 'Q6', inicio: '2026-11-16', fim: '2026-11-30' },
]

export interface Nucleo {
  id: NucleoId
  nome: string
  tatico: string
  objetivo: string
  // Estrutura de cargos, do mais alto para o mais baixo.
  cargos: string[]
}

export const NUCLEOS: Nucleo[] = [
  {
    id: 'presidencia',
    nome: 'Presidência',
    tatico: 'Tático Presidência',
    objetivo: 'Fortalecer a governança da empresa',
    cargos: ['Diretor', 'Assessor'],
  },
  {
    id: 'vp',
    nome: 'Vice-Presidência',
    tatico: 'Tático VP',
    objetivo: 'Modelo de acompanhamento estratégico',
    cargos: ['Diretor', 'Gerente', 'Assessor'],
  },
  {
    id: 'projetos',
    nome: 'Projetos',
    tatico: 'Tático Projetos',
    objetivo: 'Melhorar a qualidade dos projetos',
    cargos: ['Diretor', 'Gerente', 'Consultor'],
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    tatico: 'Tático Marketing',
    objetivo: 'Expandir portfólio de serviços',
    cargos: ['Diretor', 'Closer', 'SDR'],
  },
  {
    id: 'gp',
    nome: 'Gestão de Pessoas',
    tatico: 'Tático GP',
    objetivo: 'Incentivar a formação de lideranças',
    cargos: ['Diretor', 'Gerente', 'Assessor'],
  },
]

// 8.2 · Contagem por regra na Quinzena 4 (atual). Inclui as atividades dos membros da demonstração.
// As linhas do briefing original foram mantidas e redistribuídas na estrutura atual de núcleos:
// CS → Presidência, Comercial → Vice-Presidência; Projetos, Marketing e GP seguem iguais.
export interface Contagem {
  atividades: number
  R1: number
  R2: number
  R3: number
  R4: number
  bonus: CodigoBonus[]
}

export const QUINZENA_ATUAL: Record<NucleoId, Contagem> = {
  presidencia: { atividades: 24, R1: 20, R2: 2, R3: 1, R4: 1, bonus: ['R5'] },
  vp: { atividades: 18, R1: 13, R2: 2, R3: 1, R4: 2, bonus: [] },
  projetos: { atividades: 30, R1: 23, R2: 4, R3: 2, R4: 1, bonus: ['R6'] },
  marketing: { atividades: 15, R1: 9, R2: 3, R3: 2, R4: 1, bonus: [] },
  gp: { atividades: 20, R1: 14, R2: 3, R3: 1, R4: 2, bonus: ['R5'] },
}

// 8.3 · Índices fechados das quinzenas anteriores. O Q4 sai do cálculo de QUINZENA_ATUAL.
export const HISTORICO_INDICE: Record<NucleoId, { Q1: number; Q2: number; Q3: number }> = {
  presidencia: { Q1: 2.1, Q2: 2.25, Q3: 2.4 },
  vp: { Q1: 2.2, Q2: 2.15, Q3: 2.1 },
  projetos: { Q1: 2.35, Q2: 2.55, Q3: 2.5 },
  marketing: { Q1: 1.5, Q2: 1.8, Q3: 1.7 },
  gp: { Q1: 1.6, Q2: 1.7, Q3: 1.85 },
}

// 8.4 · Indicadores da Q4 que não saem da contagem (planos, ciclo e indicador próprio).
export interface Fracao {
  numerador: number
  denominador: number
}

export interface IndicadorProprio {
  nome: string
  formula: string
  tipo: 'percentual' | 'nota'
  meta: number
  fracao?: Fracao // percentual
  valor?: number // nota
}

export interface IndicadoresExtras {
  planos: Fracao | null // null = nenhum plano de ação com prazo na quinzena
  ciclo: Fracao
  proprio: IndicadorProprio
}

export const INDICADORES_Q4: Record<NucleoId, IndicadoresExtras> = {
  presidencia: {
    planos: { numerador: 2, denominador: 2 },
    ciclo: { numerador: 2, denominador: 2 },
    proprio: {
      nome: 'Metas estratégicas em dia',
      formula: 'Metas do planejamento estratégico em dia ÷ metas acompanhadas',
      tipo: 'percentual',
      fracao: { numerador: 9, denominador: 10 },
      meta: 85,
    },
  },
  vp: {
    planos: { numerador: 3, denominador: 4 },
    ciclo: { numerador: 2, denominador: 2 },
    proprio: {
      nome: 'Pautas de acompanhamento no prazo',
      formula: 'Pautas de acompanhamento enviadas aos núcleos no prazo ÷ pautas previstas',
      tipo: 'percentual',
      fracao: { numerador: 7, denominador: 9 },
      meta: 80,
    },
  },
  projetos: {
    planos: { numerador: 4, denominador: 5 },
    ciclo: { numerador: 2, denominador: 2 },
    proprio: {
      nome: 'Iniciativas no prazo',
      formula: 'Iniciativas de projeto entregues no prazo ÷ iniciativas com prazo na quinzena',
      tipo: 'percentual',
      fracao: { numerador: 17, denominador: 20 },
      meta: 85,
    },
  },
  marketing: {
    planos: { numerador: 1, denominador: 2 },
    ciclo: { numerador: 2, denominador: 2 },
    proprio: {
      nome: 'Leads com reunião agendada',
      formula: 'Leads qualificados pelos SDRs com reunião agendada ÷ leads qualificados',
      tipo: 'percentual',
      fracao: { numerador: 7, denominador: 10 },
      meta: 80,
    },
  },
  gp: {
    planos: { numerador: 3, denominador: 3 },
    ciclo: { numerador: 2, denominador: 2 },
    proprio: {
      nome: 'Membros com PDI em dia',
      formula: 'Membros com PDI atualizado ÷ membros ativos',
      tipo: 'percentual',
      fracao: { numerador: 23, denominador: 25 },
      meta: 90,
    },
  },
}

// "No prazo" fechado na Q3 (em %), usado no alerta de vermelho por 2 quinzenas seguidas.
export const NO_PRAZO_Q3: Record<NucleoId, number> = {
  presidencia: 81,
  vp: 74,
  projetos: 78,
  marketing: 62,
  gp: 72,
}

// 8.5 · Atividades da Quinzena 4. Cada atividade de membro já está contada em QUINZENA_ATUAL.
export interface Atividade {
  id: string
  titulo: string
  nucleo: NucleoId
  membroId: MembroId | null // null = outro membro do núcleo (fora da demonstração)
  prazo: string
  concluidaEm?: string
  regra: CodigoRegraAtividade
  etiqueta: string
}

export type MembroId = 'joao-pedro' | 'pedro-henrique' | 'lucas-gabriel' | 'kaua-medeiros' | 'gabriel-nunes'

export interface Membro {
  id: MembroId
  nome: string
  iniciais: string
  nucleo: NucleoId
  cargo: string // um dos cargos da estrutura do núcleo
}

export const MEMBROS: Membro[] = [
  { id: 'joao-pedro', nome: 'João Pedro', iniciais: 'JP', nucleo: 'presidencia', cargo: 'Assessor' },
  { id: 'pedro-henrique', nome: 'Pedro Henrique', iniciais: 'PH', nucleo: 'projetos', cargo: 'Consultor' },
  { id: 'lucas-gabriel', nome: 'Lucas Gabriel', iniciais: 'LG', nucleo: 'vp', cargo: 'Assessor' },
  { id: 'kaua-medeiros', nome: 'Kauã de Medeiros', iniciais: 'KM', nucleo: 'gp', cargo: 'Assessor' },
  { id: 'gabriel-nunes', nome: 'Gabriel Nunes', iniciais: 'GN', nucleo: 'marketing', cargo: 'SDR' },
]

export const ATIVIDADES: Atividade[] = [
  // João Pedro · Presidência · Assessor (5 R1, 1 R2)
  { id: 'a01', titulo: 'Preparar a pauta da RG de outubro', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-20', concluidaEm: '2026-10-19', regra: 'R1', etiqueta: 'Governança' },
  { id: 'a02', titulo: 'Consolidar o relatório mensal para o conselho', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-22', concluidaEm: '2026-10-22', regra: 'R1', etiqueta: 'Governança' },
  { id: 'a03', titulo: 'Atualizar o mapa de parceiros institucionais', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-23', concluidaEm: '2026-10-21', regra: 'R1', etiqueta: 'Relacionamento' },
  { id: 'a04', titulo: 'Enviar comunicado institucional aos membros', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-27', concluidaEm: '2026-10-26', regra: 'R1', etiqueta: 'Comunicação' },
  { id: 'a05', titulo: 'Organizar a documentação legal da empresa', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-29', concluidaEm: '2026-10-29', regra: 'R1', etiqueta: 'Jurídico' },
  { id: 'a06', titulo: 'Revisar o planejamento estratégico anual', nucleo: 'presidencia', membroId: 'joao-pedro', prazo: '2026-10-21', concluidaEm: '2026-10-24', regra: 'R2', etiqueta: 'Estratégia' },

  // Pedro Henrique · Projetos · Consultor (5 R1, 1 R2, 1 R4)
  { id: 'a07', titulo: 'Revisar cronograma do projeto de consultoria', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-19', concluidaEm: '2026-10-19', regra: 'R1', etiqueta: 'Planejamento' },
  { id: 'a08', titulo: 'Entregar relatório parcial ao cliente', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-21', concluidaEm: '2026-10-20', regra: 'R1', etiqueta: 'Entrega' },
  { id: 'a09', titulo: 'Conduzir reunião de kickoff do novo projeto', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-22', concluidaEm: '2026-10-22', regra: 'R1', etiqueta: 'Entrega' },
  { id: 'a10', titulo: 'Atualizar matriz de riscos do projeto', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-27', concluidaEm: '2026-10-27', regra: 'R1', etiqueta: 'Qualidade' },
  { id: 'a11', titulo: 'Validar escopo com o cliente', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-29', concluidaEm: '2026-10-28', regra: 'R1', etiqueta: 'Planejamento' },
  { id: 'a12', titulo: 'Documentar lições aprendidas do projeto', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-23', concluidaEm: '2026-10-27', regra: 'R2', etiqueta: 'Qualidade' },
  { id: 'a13', titulo: 'Atualizar o status report quinzenal', nucleo: 'projetos', membroId: 'pedro-henrique', prazo: '2026-10-26', regra: 'R4', etiqueta: 'Acompanhamento' },

  // Lucas Gabriel · Vice-Presidência · Assessor (3 R1, 1 R2, 1 R4)
  { id: 'a14', titulo: 'Consolidar o acompanhamento quinzenal dos núcleos', nucleo: 'vp', membroId: 'lucas-gabriel', prazo: '2026-10-19', concluidaEm: '2026-10-19', regra: 'R1', etiqueta: 'Acompanhamento' },
  { id: 'a15', titulo: 'Atualizar o painel de indicadores estratégicos', nucleo: 'vp', membroId: 'lucas-gabriel', prazo: '2026-10-22', concluidaEm: '2026-10-21', regra: 'R1', etiqueta: 'Indicadores' },
  { id: 'a16', titulo: 'Preparar a pauta da RN', nucleo: 'vp', membroId: 'lucas-gabriel', prazo: '2026-10-28', concluidaEm: '2026-10-28', regra: 'R1', etiqueta: 'Governança' },
  { id: 'a17', titulo: 'Revisar o planejamento operacional da VP', nucleo: 'vp', membroId: 'lucas-gabriel', prazo: '2026-10-20', concluidaEm: '2026-10-23', regra: 'R2', etiqueta: 'Estratégia' },
  { id: 'a18', titulo: 'Registrar a ata da reunião de acompanhamento', nucleo: 'vp', membroId: 'lucas-gabriel', prazo: '2026-10-27', regra: 'R4', etiqueta: 'Acompanhamento' },

  // Kauã de Medeiros · Gestão de Pessoas · Assessor (5 R1, 1 R2)
  { id: 'a19', titulo: 'Organizar a capacitação interna', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-20', concluidaEm: '2026-10-20', regra: 'R1', etiqueta: 'Capacitação' },
  { id: 'a20', titulo: 'Aplicar pesquisa de clima organizacional', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-22', concluidaEm: '2026-10-21', regra: 'R1', etiqueta: 'Pessoas' },
  { id: 'a21', titulo: 'Conduzir feedbacks individuais do núcleo', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-26', concluidaEm: '2026-10-26', regra: 'R1', etiqueta: 'Pessoas' },
  { id: 'a22', titulo: 'Atualizar planilha de PDIs', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-28', concluidaEm: '2026-10-27', regra: 'R1', etiqueta: 'Pessoas' },
  { id: 'a23', titulo: 'Planejar integração dos trainees', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-29', concluidaEm: '2026-10-29', regra: 'R1', etiqueta: 'Capacitação' },
  { id: 'a24', titulo: 'Consolidar avaliação de desempenho', nucleo: 'gp', membroId: 'kaua-medeiros', prazo: '2026-10-21', concluidaEm: '2026-10-23', regra: 'R2', etiqueta: 'Pessoas' },

  // Gabriel Nunes · Marketing · SDR (2 R1, 1 R2, 1 R3, 1 R4)
  { id: 'a25', titulo: 'Qualificar os leads do formulário do site', nucleo: 'marketing', membroId: 'gabriel-nunes', prazo: '2026-10-19', concluidaEm: '2026-10-19', regra: 'R1', etiqueta: 'Prospecção' },
  { id: 'a26', titulo: 'Atualizar o pipeline de leads no CRM', nucleo: 'marketing', membroId: 'gabriel-nunes', prazo: '2026-10-23', concluidaEm: '2026-10-22', regra: 'R1', etiqueta: 'Comercial' },
  { id: 'a27', titulo: 'Enviar relatório semanal de prospecção', nucleo: 'marketing', membroId: 'gabriel-nunes', prazo: '2026-10-21', concluidaEm: '2026-10-24', regra: 'R2', etiqueta: 'Prospecção' },
  { id: 'a28', titulo: 'Fazer ligações de prospecção ativa', nucleo: 'marketing', membroId: 'gabriel-nunes', prazo: '2026-10-22', concluidaEm: '2026-10-22', regra: 'R3', etiqueta: 'Prospecção' },
  { id: 'a29', titulo: 'Fazer follow-up dos leads de setembro', nucleo: 'marketing', membroId: 'gabriel-nunes', prazo: '2026-10-24', regra: 'R4', etiqueta: 'Comercial' },

  // Demais atividades vencidas (R4) de outros membros, para "Para recuperar pontos"
  { id: 'a30', titulo: 'Atualizar o regimento interno', nucleo: 'presidencia', membroId: null, prazo: '2026-10-27', regra: 'R4', etiqueta: 'Governança' },
  { id: 'a31', titulo: 'Atualizar o banco de talentos', nucleo: 'gp', membroId: null, prazo: '2026-10-23', regra: 'R4', etiqueta: 'Pessoas' },
  { id: 'a32', titulo: 'Enviar convocação da RG de novembro', nucleo: 'gp', membroId: null, prazo: '2026-10-28', regra: 'R4', etiqueta: 'Governança' },
  { id: 'a33', titulo: 'Atualizar o Monday com as entregas dos núcleos', nucleo: 'vp', membroId: null, prazo: '2026-10-25', regra: 'R4', etiqueta: 'Acompanhamento' },
]

// 8.6 · Histórico da carteira PIPJ (igual para todos os membros da demonstração).
export interface LancamentoPIPJ {
  data: string
  descricao: string
  valor: number
  status: 'Creditado' | 'Aprovada'
}

export const PIPJ_HISTORICO: LancamentoPIPJ[] = [
  { data: '2026-09-05', descricao: 'Crédito PIPJ de setembro', valor: 120, status: 'Creditado' },
  { data: '2026-09-22', descricao: 'Retirada — capacitação', valor: -60, status: 'Aprovada' },
  { data: '2026-10-05', descricao: 'Crédito PIPJ de outubro', valor: 90, status: 'Creditado' },
]
