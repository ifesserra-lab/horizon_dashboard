# Product Backlog – Horizon Dashboard
**Última atualização:** 10/01/2026
**Responsável (PO):** Antigravity (Senior Lead)
**Versão do Documento:** 1.0

---

# 1. Visão Geral
Este Backlog foca na **Visualização e Acessibilidade** dos dados acadêmicos extraídos pelo pipeline de ETL.

---

# 2. Epics & User Stories

## Epic 1: Portal de Grupos de Pesquisa (Release 1)
**Objetivo**: Permitir a descoberta e detalhamento dos grupos de pesquisa da instituição.

### US-001 – Listagem e Busca de Grupos
```yaml
id: US-001
milestone: R1
prioridade: Alta
tamanho: 5
origem: [RF-01, RF-14]
tags: [type:feature, area:frontend, component:search]
```

#### Descrição
Implementar a página inicial com listagem de grupos em Grid/Cards e funcionalidade de busca/filtro em tempo real.

#### Critérios de Aceitação
- **Funcional**:
    - [x] Visualização em Cards com Nome, Líder, Área e Campus.
    - [x] Busca textual por Nome do Grupo ou Líder.
    - [x] Filtros por Campus e Área do Conhecimento.
- **UI/UX**:
    - [x] Design responsivo (Mobile/Desktop).
    - [x] Feedback visual de carregamento (Skeleton) ou lista vazia.

### US-002 – Detalhes do Grupo
```yaml
id: US-002
milestone: R1
prioridade: Alta
tamanho: 8
origem: [RF-07, RF-09]
tags: [type:feature, area:frontend, component:details]
```

#### Descrição
Página detalhada do grupo exibindo metadados completos, lista de membros, linhas de pesquisa e contatos.

#### Critérios de Aceitação
- **Funcional**:
    - [x] Exibição do Nome, Sigla, Link CNPq e Descrição.
    - [x] Lista de Membros com fotos e link para Lattes.
    - [x] Breadcrumbs para navegação hierárquica.
- **Tech**:
    - [x] Rota dinâmica `/groups/[id]`.
    - [x] Build estático (SSG) para performance.

---

## Epic 2: Perfis de Pesquisadores (Release 2)
**Objetivo**: Dar visibilidade à produção individual dos pesquisadores.

### US-003 – Página de Perfil do Pesquisador
```yaml
id: US-003
milestone: R2
prioridade: Alta
tamanho: 8
origem: [RF-02]
tags: [type:feature, area:frontend]
```

#### Descrição
Página individual do pesquisador consolidando dados do Lattes (Resumo, Formação, Produções).

#### Critérios de Aceitação
- [ ] Foto, Nome, Bio e Instituição de vínculo.
- [ ] Timeline de Formação Acadêmica.
- [ ] Lista de Artigos e Orientações recentes.

---

## Epic 3: Transparência Financeira (Release 3)
**Objetivo**: Visualização dos recursos captados e executados.

### US-004 – Dashboard de Fomento
```yaml
id: US-004
milestone: R3
prioridade: Média
tamanho: 13
origem: [RF-04]
tags: [type:feature, area:frontend, component:charts]
```

#### Descrição
Gráficos e tabelas exibindo a distribuição de bolsas e recursos de projetos por Campus e Área.

#### Critérios de Aceitação
- [ ] Gráfico de Barras: Recursos por Área.
- [ ] Gráfico de Pizza: Tipos de Bolsa.
- [ ] Filtros temporais (Ano a Ano).

---

## Epic 4: Métricas de Impacto (Release 4)

### US-005 – Visualização de Impacto Científico
```yaml
id: US-005
milestone: R4
prioridade: Baixa
tamanho: 5
origem: [RF-05]
tags: [type:feature, area:frontend]
```

#### Descrição
Exibir métricas consolidadas (Índice H, Citações totais) integradas aos cards de grupos e perfis.

---

# 3. Backlog Refinado (R1 - Entregue)

| ID | Título | Status | PR/Commit |
|----|--------|--------|-----------|
| **US-001** | Listagem de Grupos | **Done** | v1.0.0 |
| **US-002** | Detalhes do Grupo | **Done** | v1.0.0 |
| **Fix** | Remoção de Avatares (Listagem) | **Done** | v1.0.3 |
| **Task** | Dados Reais & KPIs | **Done** | v1.0.4 |
| **US-006** | Dashboard de Áreas de Conhecimento | **Done** | v1.0.6 |
| **US-011** | Top 10 Research Lines (Home) | **Done** | v1.0.6 |
| **US-012** | Top 10 Research Lines (Areas) | **Done** | v1.0.6 |
| **US-015** | Separação de Membros | **Done** | v1.0.10 |
| **US-016** | Catálogo de Projetos de Pesquisa | **Ready** | - |
| US-017 | Detalhes do Projeto de Pesquisa | Ready | 1.0.13 |
### US-006 – Dashboard de Áreas de Conhecimento
```yaml
id: US-006
milestone: R1
prioridade: Alta
tamanho: 5
origem: [RF-18, RF-14]
tags: [type:feature, area:frontend, component:dashboard]
```

#### Descrição
Implementar uma página dedicada para visualizar a distribuição dos grupos de pesquisa por áreas acadêmicas.

#### Critérios de Aceitação
- **Funcional**:
    - [x] Dashboad Summary com KPIs (Grupos, Pesquisadores, Campi).
    - [x] Listagem de áreas com grupos e campi vinculados.
    - [ ] Busca em tempo real por nome da área ou grupos.
- **UI/UX**:
    - [x] Design responsivo.
    - [x] Estilo premium seguindo o padrão da plataforma.

### US-011 – Top 10 Linhas de Pesquisa (Dashboard Home)
```yaml
id: US-011
milestone: R1
prioridade: Alta
tamanho: 3
origem: [RF-19]
tags: [type:feature, area:frontend, component:charts]
```

#### Descrição
Substituir a card de "Distribuição por Área" na home pelo "Top 10 Linhas de Pesquisa", filtrando áreas genéricas para mostrar temas específicos.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Cálculo dinâmico das 10 linhas mais frequentes.
    - [ ] Filtro automático de áreas genéricas (ex: 'Educação', 'Interdisciplinar').
- **UI/UX**:
    - [ ] Rótulos atualizados para "Linha de Pesquisa".
    - [ ] Tooltip/Texto explicativo se necessário.

### US-012 – Top 10 Linhas de Pesquisa (Página de Áreas)
```yaml
id: US-012
milestone: R1
prioridade: Média
tamanho: 3
origem: [RF-19]
tags: [type:feature, area:frontend]
```

#### Descrição
Adicionar um card de visualização do "Top 10 Linhas de Pesquisa" na página de Áreas de Conhecimento, similar ao da home, para fornecer contexto imediato sobre os temas mais fortes.


### US-013 – Separação de Membros por Função (Detalhes do Grupo)
```yaml
id: US-013
milestone: R1
prioridade: Alta
tamanho: 3
origem: [RF-22]
tags: [type:feature, area:frontend, component:details]
```

#### Descrição
Refatorar a seção de membros na página de detalhes do grupo (`src/pages/groups/[id].astro`) para exibir pesquisadores e estudantes em seções distintas, melhorando a organização visual e hierarquia.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Separar membros em seções: "Pesquisadores", "Estudantes" e "Técnicos" (se houver).
    - [ ] Manter os Líderes destacados ou incluídos na seção de Pesquisadores (conforme regra de negócio, geralmente líderes são pesquisadores).
- **UI/UX**:
    - [ ] Títulos de seção claros para cada grupo.
    - [ ] Manter o design dos cards de membros existente.

### US-017: Detalhes do Projeto de Pesquisa
**Como** um pesquisador ou gestor,  
**Eu quero** ver os detalhes completos de um projeto de pesquisa específico,  
**Para que** eu possa entender seu escopo, período de execução e status.

**Critérios de Aceite:**
- A página deve ser acessível via rota `/projects/[id]`.
- Exibir nome, status (com badge colorido), período (início/fim) e descrição.
- Design consistente com o restante da plataforma (glassmorphism).
- Navegação de volta para a lista de projetos.
- Responsividade (Mobile First) e acessibilidade (WCAG 2.1 AA).
```yaml
id: US-017
milestone: R1
prioridade: Alta
tamanho: 5
origem: [RF-26]
tags: [type:feature, area:frontend, component:projects]
```

### US-016 – Catálogo de Projetos de Pesquisa
```yaml
id: US-016
milestone: R1
prioridade: Alta
tamanho: 5
origem: [RF-25]
tags: [type:feature, area:frontend, component:projects]
```

#### Descrição
Implementar uma página para listagem de todos os projetos de pesquisa (iniciativas) da instituição, permitindo a descoberta de temas e parcerias.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Visualização em Cards com Nome do Projeto, Status, Datas e Vínculos.
    - [ ] Busca textual por Nome do Projeto.
    - [ ] Filtro por Status (ativo/concluído).
- **UI/UX**:
    - [ ] Design responsivo (Mobile/Desktop).
    - [ ] Estilo premium com glassmorphism.
    - [ ] Badge de Status colorido de acordo com o estado do projeto.

### US-014 – Identificação de Egressos (Detalhes do Grupo)
```yaml
id: US-014
milestone: R1
prioridade: Média
tamanho: 3
origem: [RF-23]
tags: [type:feature, area:frontend, component:details]
```

#### Descrição
Como usuário, quero identificar facilmente quais membros são egressos (ex-membros) na lista do grupo de pesquisa, para entender o histórico de participação.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Identificar membros com `end_date` preenchido como Egressos.
    - [ ] Adicionar um badge visual ou indicador "Egresso" no card do membro.
    - [ ] Aplicar estilo visual distinto (ex: tons de cinza ou opacidade reduzida) para diferenciar de membros ativos.
- **UI/UX**:
    - [ ] Badge "Egresso" visível.
    - [ ] Tooltip (opcional) indicando período de participação se disponível.


---

# 2. Epics & User Stories
### UI Consistency: Padronização de Ícones
**Descrição**: Padronizar o ícone de "Áreas de Conhecimento" no menu lateral para corresponder ao ícone utilizado no Dashboard.
**Critérios de Aceitação**:
- Ícone do menu lateral idêntico ao do card "Áreas de Conhecimento" da home.
- RF Relacionado: RF-21.

## Epic 1: Extração SigPesq (Release 1)
**Objetivo**: Coletar dados de projetos da base SigPesq.

### US-001 – Extração de Projetos SigPesq
```yaml
id: US-001
milestone: R1
prioridade: Alta
tamanho: 8
origem: [RF-01, RNF-01, RNF-04, RNF-06]
tags: [type:feature, area:backend, source:sigpesq]
dependencias: []
modulos_afetados: [src/adapters/sources/sigpesq, src/flows]
```

#### Descrição
Desenvolver o pipeline de extração para o SigPesq. O sistema deve conectar e extrair dados de **Projetos**, **Grupos de Pesquisa** e **Bolsistas**, persistindo-os no Supabase.

#### Critérios de Aceitação (Definition of Done)
- **Funcional**:
    - [ ] Dados de **Projetos** extraídos (Título, Data, Status).
    - [ ] Dados de **Grupos de Pesquisa** extraídos (Líder, Área, certificado).
    - [ ] Dados de **Bolsistas** extraídos (Nome, Modalidade de bolsa, Vigência).
    - [ ] Mapeamento correto utilizando entidades da lib **`research_domain_lib`** (`Project`, `ResearchGroup`, `Researcher`).
- **Teste (TDD)**:
    - [ ] Teste Unitário: Parser de HTML/JSON do SigPesq com mocks.
    - [ ] Teste Integração: Gravação via `ResearchDomainLib` (ou suas abstrações).
    - [ ] Cobertura > 80% no módulo `adapters/sources/sigpesq`.
- **Deploy**:
    - [ ] Flow `ingest_sigpesq` registrado no Prefect.
    - [ ] Execução bem-sucedida em ambiente de Staging.
- **Observabilidade**:
    - [ ] Logs de "Início", "Extração (Qtd)", "Carga" e "Fim".

#### Tasks Sugeridas
1.  **T-001 [Dev]**: Implementar `SigPesqClient` (Source Adapter).
    - *Critério*: Passar testes unitários com HTML mockado.
2.  **T-002 [Dev]**: Implementar `SigPesqMapper` (Raw -> Domain).
    - *Critério*: Transformação valida tipos Pydantic.
3.  **T-003 [Ops]**: Criar Flow Prefect e Dockerfile.
    - *Critério*: Container sobe e flow registra no server.

---

## Epic 2: Extração Lattes (Release 2)
**Objetivo**: Enriquecer dados de pesquisadores (Currículo, Produção).

### US-002 – Extração de Currículo Lattes (XML/Zip)
```yaml
id: US-002
milestone: R2
prioridade: Alta
tamanho: 13
origem: [RF-02, RF-06, RNF-01]
tags: [type:feature, area:backend, source:lattes]
dependencias: [US-001]
modulos_afetados: [src/adapters/sources/lattes, src/core/logic]
```

#### Descrição
Processar arquivos XML de currículos Lattes para extrair dados pessoais e produções bibliográficas. Deve lidar com desduplicação de autores (`RF-06`).

#### Critérios de Aceitação (Definition of Done)
- **Funcional**:
    - [ ] XML parseado corretamente para Objetos de Domínio (`Researcher`, `Publication`).
    - [ ] Identificação única por ID Lattes (16 dígitos).
- **Teste (TDD)**:
    - [ ] Teste Unitário: Parser XML com massa de dados de exemplo.
    - [ ] Teste de Lógica: Algoritmo de normalização de nomes.
- **Deploy**:
    - [ ] Flow `ingest_lattes` capaz de processar lote de zips.
    - [ ] Infraestrutura de disco/volume montada para leitura de arquivos.

#### Tasks Sugeridas
1.  **T-004 [Dev]**: Criar `LattesXMLParser`.
    - *Critério*: Extrair nome, resumo e lista de artigos.
2.  **T-005 [Dev]**: Implementar Lógica de `Merge/Deduplication`.
    - *Critério*: Teste com 2 XMLs do mesmo autor (versões diferentes) resulta em 1 registro atualizado.

---

## Epic 3: Dados de Execução FAPES (Release 3)
**Objetivo**: Monitorar execução financeira e bolsas.

### US-003 – Dados Financeiros e Bolsas
```yaml
id: US-003
milestone: R3
prioridade: Média
tamanho: 8
origem: [RF-04]
tags: [type:feature, area:backend, source:fapes]
dependencias: []
```

#### Descrição
Extrair dados do Portal da Transparência/Dados Abertos sobre repasses da FAPES.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Extração de valores (R$) e beneficiários.
    - [ ] Vínculo com Projetos existentes (se houver chave comum).
- **Teste**:
    - [ ] Teste de parsing de CSV/API Fapes.
- **Deploy**:
    - [ ] Flow agendado (Cron) para rodar mensalmente.

---

### US-006 – Integração API FAPES (Projetos e Bolsas)
```yaml
id: US-006
milestone: R3
prioridade: Alta
tamanho: 8
origem: [RF-04]
tags: [type:feature, area:backend, source:fapes]
dependencias: []
modulos_afetados: [src/adapters/sources/fapes, src/flows]
```

#### Descrição
Desenvolver a integração com a **API da FAPES** para extrair dados estruturados de:
1.  **Projetos** (Títulos, vigência, valores).
2.  **Bolsistas** (Beneficiários de bolsas).
3.  **Pagamentos** (Execução financeira).

#### Critérios de Aceitação (Definition of Done)
- **Funcional**:
    - [ ] Conexão autenticada/segura com API FAPES.
    - [ ] Extração de dados de **Projetos** mapeados para o Domínio.
    - [ ] Extração de dados de **Bolsistas** mapeados para o Domínio.
    - [ ] Extração de dados de **Pagamentos** financeiros.
- **Teste (TDD)**:
    - [ ] Teste Unitário: Client HTTP com Mock da API FAPES.
    - [ ] Teste de Contrato: Validação do Schema JSON retornado.
- **Deploy**:   
    - [ ] Flow `ingest_fapes_api` agendado.
- **Observabilidade**:
    - [ ] Logs detalhando: "Projetos Encontrados"  , "Novos Baixados", "Falha na Extração".

#### Tasks Sugeridas
1.  **T-006 [Dev]**: Criar `FapesSiteScraper` para listar e baixar PDFs.
    - *Critério*: Salvar arquivos com nomenclatura padronizada.
2.  **T-007 [Dev]**: Implementar `EditalPDFParser` com Docling.
    - *Critério*: Converter PDF para Markdown com layout preservado.
3.  **T-008 [Dev]**: Implementar `EditalMatcher` (Regex/NLP).
    - *Critério*: Extrair Tabela de Cronograma e Parágrafo de Objetivo.
4.  **T-009 [Ops]**: Criar Flow Prefect com Persistência.

---

## Epic 4: Metadados Google Scholar (Release 4)
**Objetivo**: Métricas de impacto.

### US-004 – Metadados e Citações
```yaml
id: US-004
milestone: R4
prioridade: Baixa
tamanho: 5
origem: [RF-05]
tags: [type:feature, source:scholar]
```

#### Descrição
Busca de perfil e métricas (H-Index) via Scraper.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] H-Index atualizado para pesquisador.
- **Teste**:
    - [ ] Mock severo do Scholar para evitar banimento em CI.
- **Deploy**:
    - [ ] Uso de Proxies configurados no Deploy (Env Vars).

---

## Cross-Cutting (Arquitetura)

### US-005 – Observabilidade e Idempotência
```yaml
id: US-005
milestone: R1
prioridade: Crítica
tamanho: 5
origem: [RNF-01, RNF-06]
tags: [type:arch, area:core]

## Epic 5: Ingestão de Grupos de Pesquisa (Excel) (Release 1)
**Objetivo**: Processar planilhas extraídas do SigPesq e popular o domínio de Grupos de Pesquisa.

### US-007 – Carga de Grupos de Pesquisa (Excel -> DB)
```yaml
id: US-007
milestone: R1
prioridade: Alta
tamanho: 5
origem: [RF-01]
tags: [type:feature, area:backend, source:sigpesq]
dependencias: [US-001]
modulos_afetados: [src/flows, src/core/logic]
```

#### Descrição
Ler o arquivo Excel de Grupos de Pesquisa (processado na US-001/Extração) e persistir utilizando os Controllers da `research_domain_lib`. Deve garantir a criação da hierarquia (Universidade -> Campus -> Grupo).

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Leitura do Excel `data/raw/sigpesq/research_group/*.xlsx`.
    - [ ] **Universidade** "UFSC" criada (se não existir) via `UniversityController`.
    - [ ] **Campus** "Florianópolis" criado (se não existir) via `CampusController`.
    - [ ] **Grupo de Pesquisa** criado com nome, sigla e vínculos via `ResearchGroupController`.
- **Teste**:
    - [ ] Teste de Integração com banco (Mock ou Local) validando a criação dos registros.
- **Deploy**:
    - [ ] Flow `ingest_sigpesq_groups` executável via `app.py`.

#### Tasks Sugeridas
1.  **T-010 [Dev]**: Implementar `ResearchGroupExcelLoader`.
    - *Critério*: Ler Excel com Pandas e iterar linhas.
2.  **T-011 [Dev]**: Implementar Lógica de Carga (Service).
    - *Critério*: Usar `UniversityController`, `CampusController`, `ResearchGroupController` para idempotência.


#### Descrição
Implementar Base Repository com Loguru e lógica de `ON CONFLICT DO UPDATE`.

#### Critérios de Aceitação
- **Funcional**:
    - [ ] Logs aparecem no Stdout e UI do Prefect.
    - [ ] Inserir registro X duas vezes não cria duplicata.
- **Teste**:
    - [ ] Teste de Repositório (Integration) provando idempotência.
    - [ ] Teste validando formato JSON dos logs.
- **Deploy**:
    - [ ] Variáveis de ambiente de LOG_LEVEL configuráveis.

---

## Epic 6: Atualização de Grupos de Pesquisa CNPq (Release 2)
**Objetivo**: Enriquecer dados dos grupos de pesquisa com informações oficiais do CNPq (DGP).

### US-009 – Atualização de Dados de Grupos via DGP/CNPq
```yaml
id: US-009
milestone: R2
prioridade: Média
tamanho: 8
origem: [RF-09, RNF-01, RNF-02, RNF-06]
tags: [type:feature, area:backend, source:cnpq]
dependencias: [US-007]
modulos_afetados: [src/flows, src/core/logic/strategies]
```

#### Descrição
Desenvolver um novo pipeline que extrai URLs de espelho de grupos do banco de dados, utiliza a lib `dgp_cnpq_lib` para coletar dados atualizados (nome, líderes, linhas de pesquisa) e atualiza os membros do grupo.

#### Critérios de Aceitação (Definition of Done)
- **Funcional**:
    - [ ] Extração de URLs de grupos existentes no DB via `ResearchGroupRepository`.
    - [ ] Uso da `dgp_cnpq_lib` para extrair dados do espelho.
    - [ ] Atualização dos dados do grupo (Líderes, Linhas de Pesquisa) no DB.
    - [ ] Sincronização de membros do grupo (inserção de novos, atualização de participações).
- **Teste (TDD)**:
    - [ ] Teste Unitário: Estratégia de mapeamento dos dados da lib para o domínio `ResearchGroup`.
    - **Tasks**:
        - Create `CnpqCrawlerAdapter` to connect with `dgp_cnpq_lib`.
        - Implement `CnpqSyncLogic` for orchestration.
        - Create Sync Flow.

### US-010: Sincronização de Egressos CNPq
- **Description**: Como gestor, quero que os ex-membros (egressos) dos grupos de pesquisa sejam sincronizados com suas respectivas datas de saída, para manter o histórico fiel da participação.
- **Acceptance Criteria**:
    - Extrair lista de egressos do CNPq.
    - Identificar pesquisadores/estudantes já existentes ou criar novos.
    - Atualizar a associação no grupo (TeamMember) preservando a `start_date` e preenchendo a `end_date`.
    - Garantir que egressos não sejam reativados como membros ativos incorretamente.
- **Priority**: High
- **Tasks**:
    - Atualizar `CnpqCrawlerAdapter` para extrair egressos.
    - Atualizar `CnpqSyncLogic` para processar egressos.
- **Deploy**:
    - [ ] Flow `sync_cnpq_groups` registrado e explorável no `app.py`.
- **Observabilidade**:
    - [ ] Log de "Qtd de Grupos Processados", "Sucesso/Erro por URL".

#### Tasks Sugeridas
1.  **T-012 [Dev]**: Implementar `CnpqCrawlerStrategy`.
    - *Critério*: Mapear `dict` retornado pela lib para as entidades do domínio.
2.  **T-013 [Ops]**: Criar Flow Prefect `sync_cnpq_groups`.
    - *Critério*: Flow orquestra: Seleção -> Crawler -> Persistência.

---

# 4. Backlog Refinado (Release 1)

| ID | Título | Milestone | Status |
|----|--------|-----------|--------|
| **US-005** | Observabilidade e Idempotência (Base) | R1 | **Ready** |
| **US-001** | Extração Projetos SigPesq | R1 | **Ready** |
| **US-006** | Extração Editais FAPES (PDF) | R3 | **Ready** |
| **US-011** | Top 10 Research Lines (Home) | R1 | **PR #25** |
| **US-012** | Top 10 Research Lines (Areas) | R1 | **PR #25** |


---

# 5. Definition of Ready (DoR) Check for R1
- [x] US-005 e US-001 possuem arquitetura definida em `SI.3-design.md`.
- [x] Critérios de Teste e Deploy explícitos.
- [x] Origem rastreada para `SI.1`.
