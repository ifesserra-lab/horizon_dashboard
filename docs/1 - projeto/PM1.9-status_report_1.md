# Status Report 1
**Projeto:** Horizon Dashboard
**Período:** 01/01/2026 a 15/01/2026
**Versão Relatada:** v1.1.5 (US-024: Data Sync & Teams)
| **US-024** | Sincronização de Equipes e Dados | **Entregue** | v1.1.5 |
**Responsável:** Antigravity (Senior PM)

---

# 1. Resumo Executivo
A **Release R1 (Portal de Grupos)** foi refinada com a integração de dados reais (canonical) e melhorias na visualização da distribuição por área. A interface agora consome dados de 332 grupos de pesquisa.

---

# 2. Progresso da Sprint / Iteração
| Item | Descrição | Status | PR/Versão |
|------|-----------|--------|-----------|
| **US-001** | Listagem e Busca de Grupos | **Entregue** | v1.0.0 |
| **US-002** | Detalhes do Grupo | **Entregue** | v1.0.0 |
| **Fix** | Contraste e Tema Light (Acessibilidade) | **Entregue** | v1.0.2 |
| **Fix** | Remoção de Avatares (Listagem) | **Entregue** | v1.1.0 |
| **Task** | Dados Reais (research_groups_canonical.json) | **Entregue** | v1.0.4 |
| **US-003** | Top 10 Áreas de Conhecimento (Old) | **Entregue** | v1.0.4 |
| **US-011** | Top 10 Research Lines (Home) | **Entregue** | v1.0.6 |
| **US-012** | Top 10 Research Lines (Areas) | **Entregue** | v1.0.6 |
| **Fix** | Limpeza de KPIs (Remoção de % de tendência) | **Entregue** | v1.0.4 |
| **US-015** | Separação de Membros (Atuais/Egressos) | **Entregue** | v1.0.10 |
| **US-006** | Dashboard de Áreas de Conhecimento | **Entregue** | v1.0.6 |
| **Task** | Busca em Áreas de Conhecimento | **Entregue** | v1.0.8 |
| **Fix** | Dashboard: `v1.0.9` (Released). | **Entregue** | v1.0.9 |
| **Fix** | Core: Stable. | **Entregue** | - |
| **US-018** | Equipe nos Detalhes do Projeto | **Entregue** | v1.1.0 |
| **US-019** | Recursos de Acessibilidade | **Entregue** | v1.1.1 |
| **US-020** | Suporte a Baixa Visão (Text Scaling) | **Entregue** | v1.1.2 |
| **US-021** | Auditoria de Qualidade (Lighthouse) | **Entregue** | v1.1.2 |
| **US-022** | SEO Social (Open Graph Tags) | **Entregue** | v1.1.3 |
| **US-023** | Bugfix: Quebra de Linha no Dashboard | **Entregue** | v1.1.4 |

---

# 3. Entregáveis Técnicos
- `src/pages/groups/index.astro`: Listagem com filtro Client-side.
- `src/pages/groups/[id].astro`: Página de Detalhes (SSG).
- `src/components/Search.astro`: Componente de Busca Reativa.
- `src/styles/global.css`: Design System e Variáveis CSS (Dark Mode).
- `docs/1 - projeto/`: Documentação de Governança atualizada.

---

# 4. Pendências e Impedimentos
| ID | Descrição | Impacto | Ação Necessária |
|----|------------|---------|-----------------|
| **IMP-01** | Dados de Lattes ainda não integrados na UI | R2 (Perfis) | Planejar Integração de JSONs de Pesquisadores. |

---

# 5. Riscos e Mitigações
| ID | Risco | Status | Mitigação |
|----|-------|--------|-----------|
| **RISK-01** | Performance em Mobile | **Monitorado** | Imagens otimizadas e pouca carga JS. |
| **RISK-02** | Contraste de Cores (Acessibilidade) | **Resolvido** | Correção de variáveis CSS na v1.0.2. |

---

# 6. Próximas Ações (Planejamento R2)
- Iniciar UI/UX da Página de Pesquisador (`/researchers/[id]`).
- Definir layout da Timeline de Formação.
- Prototipar visualização de Grafo de Co-autoria.

## 7. Aprovação
| Nome | Cargo | Data |
|------|--------|------|
| Antigravity | Senior Lead | 06/01/2026 |
