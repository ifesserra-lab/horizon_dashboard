# Status Report 6
**Projeto:** Horizon Dashboard
**Período:** 07/02/2026
**Versão Relatada:** v2.2.0-draft (Timeline & Profile Refinements)

| Versão | Descrição | Status | PR/Versão |
|--------|-----------|--------|-----------|
| **v2.2.0** | Linha do tempo do pesquisador e refinamentos de perfil | **Em Execução** | [#79](https://github.com/ifesserra-lab/horizon_dashboard/issues/79) |

**Responsável:** Antigravity (Senior PM)

---

# 1. Resumo Executivo
Esta iteração foca na implementação da **Linha do Tempo (Timeline)** do pesquisador, agregando dados de educação, projetos e orientações em uma visualização cronológica. Além disso, a modal de pesquisador está sendo refinada com links externos (Lattes, Google Scholar, Email) e badges de KPIs (Artigos, Projetos, Orientações) para uma experiência de usuário mais rica e informativa.

---

# 2. Progresso da Sprint / Iteração
| Item | Descrição | Status | PR/Versão |
|------|-----------|--------|-----------|
| **US-044** | Linha do Tempo e Refinamentos do Perfil | **Em Execução** | [#79](https://github.com/ifesserra-lab/horizon_dashboard/issues/79) |
| **Task** | Implementação do componente Timeline.astro | **Concluído** | - |
| **Task** | Implementação do componente ResearcherSmallKpis.astro | **Concluído** | - |
| **Task** | Integração na ResearcherModal.astro | **Em Andamento** | - |

---

# 3. Entregáveis Técnicos (Previstos)
- `src/components/researchers/Timeline.astro`: Componente visual de trajetória.
- `src/components/researchers/ResearcherSmallKpis.astro`: Badges de métricas rápidas.
- `src/components/researchers/ResearcherModal.astro`: Reestruturação da aba "Sobre" e cabeçalho.

---

# 4. Pendências e Impedimentos
| ID | Descrição | Impacto | Ação Necessária |
|----|------------|---------|-----------------|
| - | Nenhum impedimento identificado. | - | - |

---

# 5. Riscos e Mitigações
| ID | Risco | Status | Mitigação |
|----|-------|--------|-----------|
| **RISK-07** | Ausência de dados de educação | **Mitigado** | O componente Timeline trata dados nulos graciosamente, omitindo seções vazias. |

---

# 6. Próximas Ações
- Finalizar a lógica de renderização client-side na `ResearcherModal.astro`.
- Validar a responsividade e acessibilidade (WCAG).
- Abrir Pull Request para `developing`.

## 7. Aprovação
| Nome | Cargo | Data |
|------|--------|------|
| Antigravity | Senior Lead | 07/02/2026 |
