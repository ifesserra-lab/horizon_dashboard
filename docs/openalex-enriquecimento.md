# Enriquecimento OpenAlex — contrato de dados (ETL)

Especifica os campos a coletar do OpenAlex para o pipeline `horizon_etl`, para o
site exibir. Hoje o site só recebe `researcher_impact.json` com 5 campos
(`lattes_id, nome, fwci, h, cit`) e cobre ~64/93 docentes, porque o casamento é
**por DOI** e só **21% dos artigos têm DOI**. Este documento destrava o resto.

Fonte: OpenAlex REST API (`https://api.openalex.org`), sem chave; incluir
`?mailto=<email-institucional>` (polite pool). Snapshot com data (`gerado_em`).

## 1. Estratégia de casamento (prioridade)

1. **ORCID** do pesquisador (se disponível no Lattes) → `/authors?filter=orcid:<orcid>`.
2. **OpenAlex Author ID** resolvido uma vez e **persistido** (`openalex_id`).
3. **Busca por nome + afiliação** (`/authors?search=<nome>&filter=last_known_institutions.id:<Ifes>`), com desambiguação por coautores/instituição.
4. **Por obra**: DOI (atual) e **fuzzy título+ano+autor** para recuperar o
   OpenAlex Work ID dos 79% sem DOI (`/works?search=<título>&filter=publication_year:<ano>`).

Persistir sempre as chaves estáveis: `orcid`, `openalex_author_id`,
`openalex_work_id`, `doi` normalizado. Assim o reprocessamento é incremental.

## 2. Saída — por pesquisador (`researcher_impact.json`, ampliar)

Manter `lattes_id, nome, fwci, h, cit` e adicionar (de OpenAlex `Author`):

| campo | origem OpenAlex | uso no site |
| --- | --- | --- |
| `openalex_author_id` | `Author.id` | link estável, join |
| `orcid` | `Author.orcid` | link ORCID |
| `works_count` | `Author.works_count` | total de obras |
| `cited_by_count` | `Author.cited_by_count` | citações totais (mais completo que `cit`) |
| `i10_index` | `Author.summary_stats.i10_index` | KPI |
| `mean_citedness_2y` | `Author.summary_stats["2yr_mean_citedness"]` | proxy de fator de impacto |
| `counts_by_year` | `Author.counts_by_year[]` `{year, works_count, cited_by_count}` | **gráfico real** de obras/citações por ano |
| `topics` | `Author.topics[]` / `x_concepts[]` `{display_name, score}` | temas do pesquisador |
| `last_institution` | `Author.last_known_institutions[]` | lotação/afiliação |
| `oa_share` | derivado das obras (`is_oa`) | % acesso aberto |
| `percentile` | derivado (posição de citação) | badge "top X%" |

## 3. Saída — por publicação (novo `articles_impact.json`, join por `id`/`doi`)

De OpenAlex `Work` (`/works/doi:<doi>` ou por `openalex_work_id`):

| campo | origem | uso |
| --- | --- | --- |
| `openalex_work_id` | `Work.id` | link, join |
| `cited_by_count` | `Work.cited_by_count` | citações do artigo |
| `counts_by_year` | `Work.counts_by_year[]` | citações por ano |
| `fwci` | `Work.fwci` | impacto do próprio artigo |
| `is_oa` / `oa_status` | `Work.open_access.{is_oa, oa_status}` | selo acesso aberto (gold/green/hybrid/bronze/closed) |
| `oa_url` | `Work.open_access.oa_url` / `best_oa_location.pdf_url` | **botão "Ler (acesso aberto)"** |
| `primary_topic` | `Work.primary_topic.display_name` | tópico |
| `type` | `Work.type` | article/review/proceedings/book-chapter |
| `language` | `Work.language` | idioma |
| `is_retracted` | `Work.is_retracted` | alerta |
| `authorships` | `Work.authorships[]` `{author{id,orcid,display_name}, institutions[], countries}` | autores + afiliação + país (colaboração internacional) |
| `referenced_works_count` | `Work.referenced_works_count` | nº referências |
| `grants` | `Work.grants[]` `{funder_display_name, award_id}` | financiador |
| `sustainable_development_goals` | `Work.sustainable_development_goals[]` | ODS |
| `qualis` | (fonte externa, já citada) | estrato Qualis |

## 4. Saída — institucional (ampliar `research_impact_summary.json`)

Adicionar ao `kpis`: `oa_pct` (% obras em acesso aberto), `citacoes_por_ano[]`,
`top_topics[]`, `colaboracao_internacional_pct` (obras com coautor de país ≠ BR),
`n_paises_coautores`. Manter `gerado_em` e `fonte`.

## 5. Onde o site vai exibir (quando os campos existirem)

- **Perfil do pesquisador** (`researchers/[id]`): painel "Impacto científico"
  (já existe FWCI/h/citações) → somar obras/citações **por ano** (`counts_by_year`),
  tópicos, % OA, i10, ORCID, link OpenAlex por Author ID.
- **Página da publicação** (`publications/[id]`): citações + citações/ano, FWCI do
  artigo, **selo e link de acesso aberto** (`oa_url`), tópico, financiador, ODS,
  autores com afiliação/país. (Já há link "OpenAlex" por DOI.)
- **Índice de publicações**: filtros/rankings por **mais citados**, **acesso
  aberto**, **tópico**.
- **Painel / Impacto**: % OA institucional, citações por ano, top tópicos,
  colaboração internacional.
- **Grupos**: impacto agregado (Σ citações/FWCI dos membros).

## 6. Cobertura e honestidade

- Elevar cobertura casando por autor (ORCID/Author ID), não só por DOI.
- Sempre expor a cobertura ("N de M docentes com OpenAlex") e a data do snapshot.
- Guardar as chaves estáveis para reprocesso incremental e auditoria.
