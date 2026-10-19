# Gamificação do Acompanhamento Estratégico · VP (protótipo)

Protótipo navegável e independente de um módulo de gamificação para o sistema estratégico da Vice-Presidência da Produtiva Júnior. Feito para apresentação: hospedado na Vercel e incorporado (iframe) no Google Sites.

- Sem login e sem integrações reais (Monday, Slack, banco, financeiro).
- Dados fictícios, em memória. Nada é gravado em `localStorage` ou cookies.
- Rotas com `HashRouter` (`/#/ranking`), que funcionam dentro do iframe e ao recarregar a página.

## Telas (barra lateral → GAMIFICAÇÃO)

| Tela | Rota |
| --- | --- |
| Como funciona | `/#/como-funciona` |
| Ranking (tela inicial) | `/#/ranking` (`?visao=acumulado` para o acumulado) |
| Núcleos | `/#/nucleos/:id` (`presidencia`, `vp`, `projetos`, `marketing`, `gp`) |
| Membros | `/#/membros/:id` (`joao-pedro`, `pedro-henrique`, `lucas-gabriel`, `kaua-medeiros`, `gabriel-nunes`) |
| Indicadores | `/#/indicadores` |
| Regras | `/#/regras` |
| Área do Membro · PIPJ (simula outro sistema) | `/#/area-do-membro/:id` |

Os itens do sistema atual (Dashboard, Análise SWOT etc.) aparecem esmaecidos e sem clique.

## Núcleos e estrutura de cargos

| Núcleo | Estrutura |
| --- | --- |
| Presidência | Diretor – Assessor |
| Vice-Presidência | Diretor – Gerente – Assessor |
| Projetos | Diretor – Gerente – Consultor |
| Marketing | Diretor – Closer – SDR |
| Gestão de Pessoas | Diretor – Gerente – Assessor |

## Dados e cálculos

- `src/data/demo.ts`: núcleos, contagens por regra da quinzena 4, histórico do índice, indicadores, membros, atividades e PIPJ.
- `src/config/regras.ts`: pesos R1–R6, metas, semáforo, bônus ilustrativos do PIPJ e configurações pendentes.
- `src/lib/calculos.ts`: pontuação, índice, ranking, desempate, variações, semáforo, alertas e carteira PIPJ.

Nenhum número das telas é digitado: tudo sai do cálculo. Para conferir com o resultado esperado do briefing:

```bash
npm run check:dados
```

## Rodar localmente

Requer Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve dist/ em http://localhost:4173
```

## Publicar

1. **Subir o projeto no GitHub.** Faça push deste repositório para o GitHub.
2. **Importar o repositório na Vercel.** Em [vercel.com/new](https://vercel.com/new), escolha o repositório. A Vercel detecta o Vite sozinha (o `vercel.json` já define `npm run build` e a pasta `dist`). Clique em **Deploy**.
3. **Copiar a URL gerada**, por exemplo `https://gamificacao-vp.vercel.app`.
4. **No Google Sites:** **Inserir → Incorporar → URL**, cole a URL e ajuste o tamanho do bloco (recomendado: largura total e altura de pelo menos 700 px). Para abrir numa tela específica, use a URL com a rota, por exemplo `https://gamificacao-vp.vercel.app/#/ranking`.

O projeto não define `X-Frame-Options` nem `frame-ancestors`, então a incorporação não é bloqueada. O layout rola o conteúdo dentro do iframe, não a página inteira.

> Se a proteção de deployment da Vercel estiver ativa (Vercel Authentication), o iframe vai pedir login. Desative em **Project → Settings → Deployment Protection** para a URL de produção.

### Testar o iframe localmente

Com `npm run preview` rodando, crie um HTML qualquer e abra no navegador:

```html
<iframe src="http://localhost:4173/" style="width:100%;height:700px;border:0"></iframe>
```

## Stack

Vite · React · TypeScript · Tailwind CSS · Recharts · lucide-react · react-router-dom.
