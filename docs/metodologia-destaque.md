# Metodologia — índice de destaque

Como o Horizon ordena os resultados de "Em destaque" (busca vazia) na home.

## Fórmula

```
índice = √FWCI × 18 + publicações × 2 + projetos × 2 + participações × 1 + áreas × 2 + 1
```

O valor é então multiplicado pelo peso da **lente** selecionada (aluno,
professor ou empresa), que reordena conforme o público. Implementação em
[`src/pages/index.astro`](../src/pages/index.astro) (`score()` e `diversify()`).

## Termos e pesos

| Termo               | Peso | O que é                                                                 |
| ------------------- | ---- | ----------------------------------------------------------------------- |
| `√FWCI`             | ×18  | Impacto de citação **normalizado por área** (FWCI). 1,0 = média mundial para a mesma área, ano e tipo. Fonte: OpenAlex. |
| `publicações`       | ×2   | Número de artigos.                                                       |
| `projetos`          | ×2   | Iniciativas de pesquisa e extensão.                                     |
| `participações`     | ×1   | Vínculos em grupos de pesquisa.                                          |
| `áreas`             | ×2   | Amplitude temática (nº de áreas de conhecimento).                       |
| `+1`                | —    | Piso: garante que todo perfil pontue.                                    |

### Por que √FWCI e por que peso 18

- **Raiz quadrada:** as distribuições de citação têm cauda longa (poucos com
  valores altíssimos). A raiz estabiliza a variância, evitando que um único
  perfil domine o ranking.
- **Peso 18:** o FWCI típico fica em torno de 1 (√1 = 1), enquanto contagens
  (publicações, projetos) chegam a dezenas. O fator 18 recoloca o sinal de
  **qualidade** na mesma ordem de grandeza dos sinais de **volume**, para que o
  impacto pese sem ser esmagado pelas contagens.

> Os pesos (×18, ×2, ×1) são uma **calibração editorial** do portal — não são
> prescritos por nenhum artigo. O que é fundamentado na literatura são as
> **métricas** usadas (abaixo).

## Fundamentação

- **FWCI (Field-Weighted Citation Impact)** — impacto de citação normalizado por
  campo, ano e tipo de documento; 1,0 = média mundial. Pertence à família dos
  indicadores de citação normalizada por campo ("crown indicator" / MNCS).
  - OpenAlex, *Field-Weighted Citation Impact (FWCI)*. https://help.openalex.org/hc/en-us/articles/24735753007895-Field-Weighted-Citation-Impact-FWCI
  - Waltman, L., van Eck, N. J., van Leeuwen, T. N., Visser, M. S., & van Raan,
    A. F. J. (2011). *Towards a new crown indicator: An empirical analysis.*
    Scientometrics, 87(3), 467–481. https://arxiv.org/abs/1004.1632 ·
    doi:10.1007/s11192-011-0354-5
- **Índice h** (exibido em cada perfil, não entra no cálculo do destaque):
  - Hirsch, J. E. (2005). *An index to quantify an individual's scientific
    research output.* PNAS, 102(46), 16569–16572.
    https://doi.org/10.1073/pnas.0507655102

## Origem dos dados

- FWCI e h são derivados do **OpenAlex** (`src/data/researcher_impact.json`,
  ~93 docentes com perfil), unidos por id Lattes e, na falta, por nome
  normalizado. Ver [`src/pages/search-index.json.ts`](../src/pages/search-index.json.ts).
- Perfis sem FWCI entram com o termo de impacto zerado (contam só volume e
  amplitude).

## Rotação dos destaques

Sem busca e sem filtro, "Em destaque" alterna tipos (pesquisadores, grupos,
projetos, publicações) e rotaciona dentro do topo de cada tipo a cada visita,
para não mostrar sempre os mesmos.
