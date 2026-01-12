# SI.1 – Especificação dos Requisitos do Software
**Projeto:** Horizon ETL
**Versão:** 1.0
**Data:** 06/01/2026
**Responsável:** Antigravity (Senior Analyst)

---

## 1. Objetivo do Documento
Registrar os requisitos funcionais e não funcionais do sistema Horizon ETL, focando na extração, transformação e carga de dados de múltiplas fontes acadêmicas.

---

## 2. Escopo do Sistema
O **Horizon ETL** é uma infraestrutura de dados que automatiza a coleta de informações de pesquisa e extensão.
- **Entradas**: SigPesq, Lattes, FAPES, Google Scholar.
- **Saída**: Banco de Dados Unificado (Supabase) para consumo por outros sistemas.

---

## 3. Stakeholders
| Nome / Papel | Interesse | Responsabilidade |
|---------------|-----------|------------------|
| **Product Owner** | Priorização das fontes | Validar dados extraídos |
| **Gestores (Campus)** | Relatórios gerenciais | Definir métricas de sucesso |
| **Pesquisadores** | Visibilidade do perfil | Validar precisão dos dados |

---

## 4. Requisitos Funcionais (RF)

| ID | Requisito | Critério de Aceitação | Origem |
|----|-----------|------------------------|--------|
| **RF-01** | O sistema deve extrair dados de projetos do SigPesq. | Projetos persistidos no Supabase com metadados completos. | PM1.3 (R1) |
| **RF-02** | O sistema deve extrair dados curriculares da Plataforma Lattes. | Perfil, formação e produções carregadas para pesquisadores listados. | PM1.3 (R2) |
| **RF-04** | O sistema deve extrair dados de execução (Projetos/Bolsas/Compras) da FAPES. | Dados financeiros e de bolsistas vinculados persistidos. | PM1.3 (R3) |
| **RF-05** | O sistema deve coletar metadados do Google Scholar. | Citações e índice-h atualizados. | PM1.3 (R4) |
| **RF-06** | O sistema deve normalizar nomes de autores e instituições. | Entidades duplicadas fundidas (Merge) em ID único. | Arq. |
| **RF-07** | O sistema deve exportar dados de grupos de pesquisa de uma Unidade Organizacional para JSON. | Arquivo JSON gerado seguindo schema do ResearchGroup. | User Req. |
| **RF-08** | O sistema deve exportar dados canônicos (Organização, Campus, Áreas) para arquivos JSON separados. | Arquivos `organizations.json`, `campuses.json`, `knowledge_areas.json` gerados. | User Req. |
| **RF-09** | O sistema deve extrair e atualizar dados de grupos de pesquisa do CNPq DGP (identificação, linhas de pesquisa, membros). | Dados do grupo (espelho), membros e **linhas de pesquisa (mapeadas para Áreas do Conhecimento)** atualizados no banco de dados via `dgp_cnpq_lib`. | User Req. |
| **RF-10** | O sistema deve identificar e sincronizar membros egressos do CNPq, registrando corretamente as datas de início e fim de participação. | Membros egressos identificados e datas de participação (início/fim) persistidas no Supabase. | User Req. |
| **RF-11** | O Dashboard deve ser acessível e seguir as diretrizes WCAG 2.1 Nível AA. | Contraste adequado, navegação por teclado e compatibilidade com leitores de tela verificados. | UX Design |
| **RF-12** | O sistema deve possuir alto desempenho de carregamento (Lighthouse > 90). | LCP < 2.5s e TBT < 200ms em conexões 4G estáveis. | UX Design |
| **RF-13** | O sistema deve oferecer visualizações de dados segmentadas por perfil (Personas). | Dashboards específicos para Gestores (macros) e Pesquisadores (detalhados). | Data Analyst |
| **RF-14** | O sistema deve permitir busca e filtragem em tempo real nas listagens de grupos e áreas de conhecimento. | Pesquisa por nome, campus, área e grupos vinculados funcionando em tempo real. | User Req. |
| **RF-15** | O sistema deve possuir fluxo de CI/CD para deploy no GitHub Pages. | Build e push automatizados para a branch de produção via GitHub Actions. | User Req. |
| **RF-16** | O Dashboard deve consumir dados dos arquivos JSON canônicos (`research_groups_canonical.json`). | Dashboard exibindo dados reais em vez de mocks. | User Req. |
| **RF-17** | O Dashboard deve lidar com a ausência de nomes curtos (`short_name`) nos grupos. | Fallback visual (ex: primeira letra do nome completo) implementado nos ícones. | User Req. |
| **RF-18** | O Dashboard deve exibir uma página dedicada para 'Áreas de Conhecimento'. | Dashboard exibindo resumo por área e vinculação direta com os grupos de pesquisa. | User Req. |
| **RF-19** | O sistema deve exibir o gráfico "Top 10 Áreas de Conhecimento" na home e na página de áreas. | Dashboard | Alta |
| **RF-20** | O sistema deve listar os grupos de pesquisa em ordem alfabética e exibir a sigla (short_name) no avatar quando disponível. | Catálogo de Grupos | Média |
| RF-21 | O sistema deve manter consistência visual nos ícones de navegação e dashboard para as Áreas de Conhecimento. | UI Consistency | Baixa |
| **RF-22** | O sistema deve exibir, no detalhamento do grupo de pesquisa, a lista de membros separada por função: Pesquisadores, Estudantes e Técnicos. | Detalhamento de Grupo | Alta |
| **RF-23** | O sistema deve identificar visualmente os membros egressos (ex-membros com data de término preenchida) no detalhamento do grupo de pesquisa. | Detalhamento de Grupo | Média |
| **RF-24** | O sistema deve permitir a separação estrutural de membros ativos e egressos em sub-listas dentro de suas funções (Pesquisadores e Estudantes). | Detalhamento de Grupo | Alta |

---

## 5. Requisitos Não Funcionais (RNF)

| ID | Categoria | Descrição | Restrição Técnica |
|----|------------|-----------|-------------------|
| **RNF-01** | Idempotência | Re-execução de pipelines não deve duplicar dados. | `UPSERT` obrigatório. |
| **RNF-02** | Resiliência | Pipelines devem suportar falhas de rede (retries). | Prefect Retries. |
| **RNF-03** | Arquitetura | Código desacoplado seguindo Clean/Hexagonal Arch. | Modules `etl`, `core`. |
| **RNF-04** | Stack | Astro, Tailwind, Node.js, Supabase (Source). | PM1.0 |
| **RNF-05** | Qualidade | Cobertura de testes em lógicas de transformação. | Pytest, TDD. |
| **RNF-06** | Observabilidade | Todas as ações do sistema devem gerar logs estruturados. | Loguru/Prefect Logger. |

---

## 6. Restrições
- Rate Limits do Google Scholar e Lattes (cnpq).
- Acesso à VPN institucional pode ser necessário para SigPesq (a confirmar).
