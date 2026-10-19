import { useState } from 'react'
import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { NUCLEOS, type NucleoId } from '../data/demo'
import { fmtIndice, serieGrafico } from '../lib/calculos'
import { cx } from './ui'

// Cores fixas por núcleo, tiradas da paleta dos prints (ciano, marinho, rosa, azul).
// A identidade nunca depende só da cor: há legenda, rótulo no fim de cada linha e a tabela do ranking.
export const COR_NUCLEO: Record<NucleoId, string> = {
  cs: '#12b0d6',
  projetos: '#3d5687',
  gp: '#ec4899',
  comercial: '#3b82f6',
  marketing: '#0f7391',
  inovacao: '#8fa3c7',
}

const SIGLA: Record<NucleoId, string> = {
  cs: 'CS',
  projetos: 'Projetos',
  gp: 'GP',
  comercial: 'Comercial',
  marketing: 'Marketing',
  inovacao: 'Inovação',
}

function Dica({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const itens = [...payload].sort((a, b) => b.value - a.value)
  return (
    <div className="card px-3 py-2 text-xs shadow-sm">
      <div className="mb-1 font-semibold text-slate-900">Quinzena {label?.slice(1)}</div>
      {itens.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {NUCLEOS.find((n) => n.id === p.dataKey)?.nome}
          </span>
          <span className="font-semibold text-slate-900">{fmtIndice(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function GraficoIndice({ nucleos, altura = 280 }: { nucleos?: NucleoId[]; altura?: number }) {
  const dados = serieGrafico()
  const ids = nucleos ?? NUCLEOS.map((n) => n.id)
  const unico = ids.length === 1
  const [foco, setFoco] = useState<NucleoId | null>(null)

  return (
    <div>
      {!unico && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {ids.map((id) => (
            <button
              key={id}
              type="button"
              onMouseEnter={() => setFoco(id)}
              onMouseLeave={() => setFoco(null)}
              onFocus={() => setFoco(id)}
              onBlur={() => setFoco(null)}
              className={cx(
                'flex items-center gap-1.5 text-xs text-slate-600 transition-opacity',
                foco && foco !== id && 'opacity-40',
              )}
            >
              <span className="h-0.5 w-4 rounded-full" style={{ background: COR_NUCLEO[id] }} />
              {NUCLEOS.find((n) => n.id === id)?.nome}
            </button>
          ))}
        </div>
      )}
      <div style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 10, right: unico ? 16 : 72, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#eef1f5" vertical={false} />
            <XAxis dataKey="quinzena" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              domain={[0.8, 3]}
              ticks={[1, 1.5, 2, 2.5, 3]}
              tickFormatter={(v: number) => fmtIndice(v).replace(',00', '').replace(/0$/, '')}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<Dica />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
            {ids.map((id) => (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                stroke={unico ? '#12b0d6' : COR_NUCLEO[id]}
                strokeWidth={unico || foco === id ? 2.5 : 2}
                strokeOpacity={foco && foco !== id ? 0.2 : 1}
                dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                isAnimationActive={false}
              >
                {unico ? (
                  <LabelList
                    dataKey={id}
                    position="top"
                    offset={10}
                    formatter={(v: number) => fmtIndice(v)}
                    style={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  />
                ) : (
                  <LabelList
                    dataKey={id}
                    content={(p) => {
                      const { x, y, index } = p as { x: number; y: number; index: number }
                      if (index !== dados.length - 1) return null
                      return (
                        <text
                          x={x + 8}
                          y={y + 4}
                          fontSize={11}
                          fontWeight={600}
                          fill="#334155"
                          opacity={foco && foco !== id ? 0.3 : 1}
                        >
                          {SIGLA[id]}
                        </text>
                      )
                    }}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
