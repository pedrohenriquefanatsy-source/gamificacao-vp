// Funções de cálculo da gamificação. Nenhum resultado é digitado: tudo sai de demo.ts + regras.ts.

import {
  BONUS_PIPJ,
  METAS,
  REGRA_APOS_RECUPERAR,
  REGRAS,
  REGRAS_ATIVIDADE,
  SEMAFORO,
  type CodigoBonus,
  type CodigoRegraAtividade,
} from '../config/regras'
import {
  ATIVIDADES,
  BATALHA,
  HISTORICO_INDICE,
  INDICADORES_Q4,
  MEMBROS,
  NO_PRAZO_Q3,
  NUCLEOS,
  PIPJ_HISTORICO,
  QUINZENA_ATUAL,
  QUINZENAS,
  type Atividade,
  type Contagem,
  type Fracao,
  type MembroId,
  type Nucleo,
  type NucleoId,
} from '../data/demo'

export const QUINZENAS_FECHADAS = ['Q1', 'Q2', 'Q3', 'Q4'] as const
export type QuinzenaGrafico = (typeof QUINZENAS_FECHADAS)[number]

// ---------- Pontuação ----------

export interface LinhaPontos {
  codigo: CodigoRegraAtividade | CodigoBonus
  quantidade: number
  peso: number
  subtotal: number
}

export interface Pontuacao {
  linhas: LinhaPontos[] // R1–R4
  bonus: LinhaPontos[] // R5/R6 aplicados
  pontosAtividades: number
  pontosBonus: number
  total: number
  atividades: number
  indice: number
}

export function pontuar(c: Pick<Contagem, 'atividades' | 'R1' | 'R2' | 'R3' | 'R4'> & { bonus?: CodigoBonus[] }): Pontuacao {
  const linhas = REGRAS_ATIVIDADE.map((codigo) => ({
    codigo,
    quantidade: c[codigo],
    peso: REGRAS[codigo].pontos,
    subtotal: c[codigo] * REGRAS[codigo].pontos,
  }))
  const bonus = (c.bonus ?? []).map((codigo) => ({
    codigo,
    quantidade: 1,
    peso: REGRAS[codigo].pontos,
    subtotal: REGRAS[codigo].pontos,
  }))
  const pontosAtividades = soma(linhas.map((l) => l.subtotal))
  const pontosBonus = soma(bonus.map((l) => l.subtotal))
  const total = pontosAtividades + pontosBonus
  return {
    linhas,
    bonus,
    pontosAtividades,
    pontosBonus,
    total,
    atividades: c.atividades,
    indice: c.atividades > 0 ? total / c.atividades : 0,
  }
}

// ---------- Ranking ----------

export interface LinhaRanking {
  nucleo: Nucleo
  posicao: number
  posicaoAnterior: number
  variacao: number // > 0 subiu, < 0 caiu
  indice: number
  indiceAnterior: number
  evolucao: number
  pontos: number
  atividades: number
  noPrazoPct: number
  atrasadas: number
  pontuacao: Pontuacao
}

function noPrazoPct(c: Contagem) {
  return (c.R1 * 100) / c.atividades
}

// Ordena por índice; desempate: maior % no prazo, depois menos atrasadas (R3 + R4).
function compararAtual(a: NucleoId, b: NucleoId) {
  const ca = QUINZENA_ATUAL[a]
  const cb = QUINZENA_ATUAL[b]
  const ia = pontuar(ca).indice
  const ib = pontuar(cb).indice
  if (ia !== ib) return ib - ia
  const pa = noPrazoPct(ca)
  const pb = noPrazoPct(cb)
  if (pa !== pb) return pb - pa
  return ca.R3 + ca.R4 - (cb.R3 + cb.R4)
}

function posicoes(ordem: NucleoId[]): Record<NucleoId, number> {
  return Object.fromEntries(ordem.map((id, i) => [id, i + 1])) as Record<NucleoId, number>
}

const IDS = NUCLEOS.map((n) => n.id)

export function indiceQ4(id: NucleoId) {
  return pontuar(QUINZENA_ATUAL[id]).indice
}

export function historico(id: NucleoId): Record<QuinzenaGrafico, number> {
  return { ...HISTORICO_INDICE[id], Q4: indiceQ4(id) }
}

export function rankingAtual(): LinhaRanking[] {
  const ordem = [...IDS].sort(compararAtual)
  const ordemAnterior = [...IDS].sort((a, b) => HISTORICO_INDICE[b].Q3 - HISTORICO_INDICE[a].Q3)
  const pos = posicoes(ordem)
  const posAnt = posicoes(ordemAnterior)
  return ordem.map((id) => {
    const c = QUINZENA_ATUAL[id]
    const p = pontuar(c)
    return {
      nucleo: nucleoPorId(id),
      posicao: pos[id],
      posicaoAnterior: posAnt[id],
      variacao: posAnt[id] - pos[id],
      indice: p.indice,
      indiceAnterior: HISTORICO_INDICE[id].Q3,
      evolucao: p.indice - HISTORICO_INDICE[id].Q3,
      pontos: p.total,
      atividades: c.atividades,
      noPrazoPct: noPrazoPct(c),
      atrasadas: c.R3 + c.R4,
      pontuacao: p,
    }
  })
}

export interface LinhaAcumulado {
  nucleo: Nucleo
  posicao: number
  variacao: number
  media: number
  porQuinzena: Record<QuinzenaGrafico, number>
}

// Acumulado da batalha: média simples dos índices das quinzenas fechadas (configuração pendente).
export function rankingAcumulado(): LinhaAcumulado[] {
  const media = (id: NucleoId, qs: readonly QuinzenaGrafico[]) => {
    const h = historico(id)
    return soma(qs.map((q) => h[q])) / qs.length
  }
  const ordem = [...IDS].sort((a, b) => media(b, QUINZENAS_FECHADAS) - media(a, QUINZENAS_FECHADAS))
  const ordemAnt = [...IDS].sort((a, b) => media(b, ['Q1', 'Q2', 'Q3']) - media(a, ['Q1', 'Q2', 'Q3']))
  const pos = posicoes(ordem)
  const posAnt = posicoes(ordemAnt)
  return ordem.map((id) => ({
    nucleo: nucleoPorId(id),
    posicao: pos[id],
    variacao: posAnt[id] - pos[id],
    media: media(id, QUINZENAS_FECHADAS),
    porQuinzena: historico(id),
  }))
}

export function serieGrafico() {
  return QUINZENAS_FECHADAS.map((q) => {
    const ponto: Record<string, number | string> = { quinzena: q }
    for (const id of IDS) ponto[id] = arred2(historico(id)[q])
    return ponto
  })
}

// ---------- Destaques e reconhecimento ----------

export function destaques() {
  const ranking = rankingAtual()
  const lider = ranking[0]
  const maisEvoluiu = [...ranking].sort((a, b) => b.evolucao - a.evolucao)[0]
  const alertas = new Set(IDS.filter((id) => indicadores(id).some((i) => i.vermelhoDuasVezes)))
  // Precisa de atenção: pior colocado entre os que têm vermelho por 2 quinzenas; senão, o último.
  const comAlerta = ranking.filter((l) => alertas.has(l.nucleo.id))
  const atencao = comAlerta.length ? comAlerta[comAlerta.length - 1] : ranking[ranking.length - 1]
  return { lider, maisEvoluiu, atencao }
}

export type TipoReconhecimento = 'campeao' | 'maisEvoluiu'

export function reconhecimentoDoNucleo(id: NucleoId): TipoReconhecimento | null {
  const { lider, maisEvoluiu } = destaques()
  if (lider.nucleo.id === id) return 'campeao'
  if (maisEvoluiu.nucleo.id === id) return 'maisEvoluiu'
  return null
}

// ---------- Indicadores e semáforo ----------

export type Cor = 'verde' | 'amarelo' | 'vermelho' | 'neutro'
export type ChaveIndicador = 'registro' | 'noPrazo' | 'planos' | 'ciclo' | 'proprio'

export interface Indicador {
  chave: ChaveIndicador
  nome: string
  formula: string
  tipo: 'percentual' | 'nota'
  valor: number | null
  meta: number
  numerador?: number
  denominador?: number
  rotuloNumerador?: string
  rotuloDenominador?: string
  cor: Cor
  corAnterior: Cor | null
  vermelhoDuasVezes: boolean
}

export function semaforo(valor: number | null, meta: number, tipo: 'percentual' | 'nota' = 'percentual'): Cor {
  if (valor === null) return 'neutro'
  if (valor >= meta) return 'verde'
  const tolerancia = tipo === 'nota' ? SEMAFORO.toleranciaAmareloNota : SEMAFORO.toleranciaAmareloPP
  return meta - valor <= tolerancia ? 'amarelo' : 'vermelho'
}

function pct(f: Fracao | null) {
  return f && f.denominador > 0 ? (f.numerador * 100) / f.denominador : null
}

export const NOMES_INDICADORES: Record<ChaveIndicador, string> = {
  registro: 'Registro',
  noPrazo: 'No prazo',
  planos: 'Planos',
  ciclo: 'Ciclo',
  proprio: 'Próprio',
}

export function indicadores(id: NucleoId): Indicador[] {
  const c = QUINZENA_ATUAL[id]
  const extra = INDICADORES_Q4[id]

  const montar = (
    base: Omit<Indicador, 'cor' | 'corAnterior' | 'vermelhoDuasVezes'>,
    valorAnterior: number | null = null,
  ): Indicador => {
    const cor = semaforo(base.valor, base.meta, base.tipo)
    const corAnterior = valorAnterior === null ? null : semaforo(valorAnterior, base.meta, base.tipo)
    return { ...base, cor, corAnterior, vermelhoDuasVezes: cor === 'vermelho' && corAnterior === 'vermelho' }
  }

  const p = extra.proprio
  return [
    montar({
      chave: 'registro',
      nome: 'Registro',
      formula: '(atividades − R3) ÷ atividades',
      tipo: 'percentual',
      valor: ((c.atividades - c.R3) * 100) / c.atividades,
      meta: METAS.registro,
      numerador: c.atividades - c.R3,
      denominador: c.atividades,
      rotuloNumerador: 'atividades registradas pelo núcleo',
      rotuloDenominador: 'atividades da quinzena',
    }),
    montar(
      {
        chave: 'noPrazo',
        nome: 'Entrega no prazo',
        formula: 'R1 ÷ atividades',
        tipo: 'percentual',
        valor: noPrazoPct(c),
        meta: METAS.noPrazo,
        numerador: c.R1,
        denominador: c.atividades,
        rotuloNumerador: 'concluídas e registradas até o prazo (R1)',
        rotuloDenominador: 'atividades da quinzena',
      },
      NO_PRAZO_Q3[id],
    ),
    montar({
      chave: 'planos',
      nome: 'Planos no prazo',
      formula: 'planos de ação concluídos no prazo ÷ planos com prazo na quinzena',
      tipo: 'percentual',
      valor: pct(extra.planos),
      meta: METAS.planos,
      numerador: extra.planos?.numerador ?? 0,
      denominador: extra.planos?.denominador ?? 0,
      rotuloNumerador: 'planos concluídos no prazo',
      rotuloDenominador: 'planos com prazo na quinzena',
    }),
    montar({
      chave: 'ciclo',
      nome: 'Ciclo de acompanhamento',
      formula: 'acompanhamentos realizados ÷ acompanhamentos previstos',
      tipo: 'percentual',
      valor: pct(extra.ciclo),
      meta: METAS.ciclo,
      numerador: extra.ciclo.numerador,
      denominador: extra.ciclo.denominador,
      rotuloNumerador: 'acompanhamentos realizados',
      rotuloDenominador: 'acompanhamentos previstos',
    }),
    montar({
      chave: 'proprio',
      nome: p.nome,
      formula: p.formula,
      tipo: p.tipo,
      valor: p.tipo === 'nota' ? (p.valor ?? null) : pct(p.fracao ?? null),
      meta: p.meta,
      numerador: p.fracao?.numerador,
      denominador: p.fracao?.denominador,
    }),
  ]
}

// Texto para a pauta da RN (Reunião de Núcleos).
export function pontosDeAtencaoRN(): string {
  const linhas: string[] = []
  for (const n of NUCLEOS) {
    for (const ind of indicadores(n.id)) {
      if (ind.cor !== 'vermelho') continue
      const nome = ind.chave === 'proprio' ? ind.nome : ind.nome.toLowerCase()
      const quando = ind.vermelhoDuasVezes ? 'vermelho pela 2ª quinzena' : 'vermelho nesta quinzena'
      linhas.push(`${n.nome}: ${nome} ${formatarValor(ind)} (meta ${formatarMeta(ind)}), ${quando}`)
    }
  }
  const q = QUINZENAS.find((x) => x.id === BATALHA.quinzenaAtual)!
  return [
    `Pontos de atenção · Battle #${BATALHA.numero} · Quinzena ${q.id.slice(1)} (${formatarDataCurta(q.inicio)} a ${formatarDataCurta(q.fim)})`,
    '',
    ...linhas.map((l) => `- ${l}`),
  ].join('\n')
}

// ---------- Atividades e membros ----------

export function atividadesDoMembro(id: MembroId) {
  return ATIVIDADES.filter((a) => a.membroId === id)
}

export function contagemDe(atividades: Atividade[]) {
  const c = { atividades: atividades.length, R1: 0, R2: 0, R3: 0, R4: 0 }
  for (const a of atividades) c[a.regra]++
  return c
}

export function resumoMembro(id: MembroId) {
  const membro = membroPorId(id)
  const lista = atividadesDoMembro(id)
  const contagem = contagemDe(lista)
  const pontos = pontuar(contagem).pontosAtividades
  const pontosNucleo = pontuar(QUINZENA_ATUAL[membro.nucleo]).total
  return { membro, lista, contagem, pontos, pontosNucleo }
}

export function atividadesParaRecuperar(id: NucleoId) {
  const ganho = REGRAS[REGRA_APOS_RECUPERAR].pontos - REGRAS.R4.pontos
  return ATIVIDADES.filter((a) => a.nucleo === id && a.regra === 'R4').map((a) => ({ atividade: a, ganho }))
}

export function indiceSeRecuperar(id: NucleoId) {
  const c = QUINZENA_ATUAL[id]
  return pontuar({ ...c, R2: c.R2 + c.R4, R4: 0 }).indice
}

export function membrosDoNucleo(id: NucleoId) {
  return MEMBROS.filter((m) => m.nucleo === id)
}

// ---------- PIPJ ----------

export function carteiraPIPJ(id: MembroId) {
  const membro = membroPorId(id)
  const saldo = soma(PIPJ_HISTORICO.map((l) => l.valor))
  const tipo = reconhecimentoDoNucleo(membro.nucleo)
  const bonus = tipo === 'campeao' ? BONUS_PIPJ.campeao : tipo === 'maisEvoluiu' ? BONUS_PIPJ.maisEvoluiu : 0
  return { membro, saldo, tipo, bonus, saldoPrevisto: saldo + bonus }
}

// ---------- Batalha ----------

export function progressoBatalha() {
  const ini = Date.parse(BATALHA.inicio)
  const fim = Date.parse(BATALHA.fim)
  const ref = Date.parse(BATALHA.dataReferencia)
  return Math.round(((ref - ini) / (fim - ini)) * 100)
}

// ---------- Busca ----------

export function nucleoPorId(id: string): Nucleo {
  return NUCLEOS.find((n) => n.id === id) ?? NUCLEOS[0]
}

export function membroPorId(id: string) {
  return MEMBROS.find((m) => m.id === id) ?? MEMBROS[0]
}

// ---------- Formatação (pt-BR) ----------

export const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
export const arred2 = (n: number) => Math.round(n * 100) / 100

export function fmtIndice(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtPct(n: number | null, casas = 0) {
  if (n === null) return '—'
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`
}

export function fmtSinal(n: number) {
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`
}

export function fmtMoeda(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarValor(ind: Indicador) {
  if (ind.valor === null) return '—'
  return ind.tipo === 'nota' ? ind.valor.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : fmtPct(ind.valor)
}

export function formatarMeta(ind: Indicador) {
  return ind.tipo === 'nota' ? ind.meta.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : fmtPct(ind.meta)
}

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']

export function formatarDataCurta(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1].replace('.', '')}`
}

export function formatarData(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
}

export function periodoBatalha() {
  const [yi, mi, di] = BATALHA.inicio.split('-').map(Number)
  const [yf, mf, df] = BATALHA.fim.split('-').map(Number)
  const ini = `${di} ${MESES[mi - 1]}${yi !== yf ? ` ${yi}` : ''}`
  return `${ini} – ${df} ${MESES[mf - 1]} ${yf}`
}
