// Confere os cálculos contra o "resultado esperado" do briefing (seções 8.2 a 8.6),
// com as linhas redistribuídas na estrutura atual de núcleos (CS → Presidência, Comercial → VP).
// Uso: npm run check:dados

declare const process: { exit(code: number): never }

import { QUINZENA_ATUAL, MEMBROS, NUCLEOS } from '../src/data/demo'
import {
  carteiraPIPJ,
  destaques,
  fmtIndice,
  indicadores,
  pontosDeAtencaoRN,
  rankingAtual,
  resumoMembro,
  atividadesParaRecuperar,
} from '../src/lib/calculos'

let falhas = 0
function confere(rotulo: string, obtido: unknown, esperado: unknown) {
  const ok = JSON.stringify(obtido) === JSON.stringify(esperado)
  if (!ok) falhas++
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${rotulo}: ${JSON.stringify(obtido)}${ok ? '' : ` (esperado ${JSON.stringify(esperado)})`}`)
}

const ranking = rankingAtual()
confere(
  'Ranking Q4 (núcleo, pontos, índice)',
  ranking.map((l) => [l.posicao, l.nucleo.nome, l.pontos, fmtIndice(l.indice)]),
  [
    [1, 'Presidência', 64, '2,67'],
    [2, 'Projetos', 73, '2,43'],
    [3, 'Gestão de Pessoas', 46, '2,30'],
    [4, 'Vice-Presidência', 37, '2,06'],
    [5, 'Marketing', 25, '1,67'],
  ],
)
confere(
  'Variações Q3 → Q4',
  ranking.map((l) => [l.nucleo.nome, l.variacao]),
  [
    ['Presidência', 1],
    ['Projetos', -1],
    ['Gestão de Pessoas', 1],
    ['Vice-Presidência', -1],
    ['Marketing', 0],
  ],
)

const d = destaques()
confere('Líder', d.lider.nucleo.nome, 'Presidência')
confere('Mais evoluiu', [d.maisEvoluiu.nucleo.nome, fmtIndice(d.maisEvoluiu.evolucao)], ['Gestão de Pessoas', '0,45'])
confere('Precisa de atenção', d.atencao.nucleo.nome, 'Marketing')

confere(
  'Vermelho 2× (pauta da RN)',
  NUCLEOS.flatMap((n) => indicadores(n.id).filter((i) => i.vermelhoDuasVezes).map((i) => `${n.nome}:${i.chave}`)),
  ['Marketing:noPrazo'],
)

const esperadoMembros: Record<string, [number, number, number, number, number, number]> = {
  'joao-pedro': [6, 5, 1, 0, 0, 16],
  'pedro-henrique': [7, 5, 1, 0, 1, 15],
  'lucas-gabriel': [5, 3, 1, 0, 1, 9],
  'kaua-medeiros': [6, 5, 1, 0, 0, 16],
  'gabriel-nunes': [5, 2, 1, 1, 1, 4],
}
for (const m of MEMBROS) {
  const r = resumoMembro(m.id)
  const c = r.contagem
  confere(`Membro ${m.nome}`, [c.atividades, c.R1, c.R2, c.R3, c.R4, r.pontos], esperadoMembros[m.id])
  const n = QUINZENA_ATUAL[m.nucleo]
  const contido = c.atividades <= n.atividades && c.R1 <= n.R1 && c.R2 <= n.R2 && c.R3 <= n.R3 && c.R4 <= n.R4
  confere(`  contido no núcleo ${m.nucleo}`, contido, true)
  const estrutura = NUCLEOS.find((x) => x.id === m.nucleo)!.cargos
  confere(`  cargo "${m.cargo}" existe na estrutura (${estrutura.join(' – ')})`, estrutura.includes(m.cargo), true)
}

for (const n of NUCLEOS) {
  const c = QUINZENA_ATUAL[n.id]
  confere(`Soma R1–R4 = atividades (${n.nome})`, c.R1 + c.R2 + c.R3 + c.R4, c.atividades)
  confere(`R4 listados em "Para recuperar" (${n.nome})`, atividadesParaRecuperar(n.id).length, c.R4)
}

confere(
  'PIPJ (saldo, bônus, previsto)',
  MEMBROS.map((m) => {
    const w = carteiraPIPJ(m.id)
    return [m.nome, w.saldo, w.bonus, w.saldoPrevisto]
  }),
  [
    ['João Pedro', 150, 30, 180],
    ['Pedro Henrique', 150, 0, 150],
    ['Lucas Gabriel', 150, 0, 150],
    ['Kauã de Medeiros', 150, 15, 165],
    ['Gabriel Nunes', 150, 0, 150],
  ],
)

console.log('\nTexto para a RN:\n' + pontosDeAtencaoRN())
console.log(falhas ? `\n${falhas} falha(s).` : '\nTudo confere.')
process.exit(falhas ? 1 : 0)
