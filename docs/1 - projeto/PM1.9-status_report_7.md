# Status Report 7
**Projeto:** Horizon Dashboard  
**Período:** 07/02/2026  
**Versão Relatada:** v2.1.1 (CI/CD Fix & Dashboard Refinements)

| Versão | Descrição | Status | PR/Versão |
|--------|-----------|--------|-----------|
| **v2.1.1** | CI/CD fix and Dashboard refinements | **Concluído** | [#85](https://github.com/ifesserra-lab/horizon_dashboard/pull/85) |

**Responsável:** Antigravity (Senior PM)

---

# 1. Resumo Executivo
Esta iteração resolveu um bug crítico no pipeline de deploy (conflito de artefatos no GitHub Pages) e aplicou refinamentos solicitados no dashboard de orientações, incluindo a remoção do KPI de investimento mensal e a filtragem de dados inconsistentes ("None") na visualização de orientadores.

---

# 2. Progresso da Sprint / Iteração
| Item | Descrição | Status | PR/Versão |
|------|-----------|--------|-----------|
| **Bugfix** | Correção do erro "Multiple artifacts named github-pages found" | **Concluído** | [#83](https://github.com/ifesserra-lab/horizon_dashboard/pull/83) |
| **Refinement** | Remoção do KPI de Investimento Mensal | **Concluído** | [#84](https://github.com/ifesserra-lab/horizon_dashboard/pull/84) |
| **Refinement** | Filtragem de orientadores "None" no Top 10 | **Concluído** | [#84](https://github.com/ifesserra-lab/horizon_dashboard/pull/84) |
| **Investigation** | Análise de ranking de Daniel Cruz Cavalieri | **Concluído** | - |

---

# 3. Entregáveis Técnicos
- `.github/workflows/deploy.yml`: Refatorado para upload explícito.
- `src/pages/advisorships/index.astro`: Lógica de filtragem e KPI atualizada.
- `src/components/advisorships/AdvisorshipKpiCards.astro`: Layout ajustado para 5 cards.

---

# 4. Pendências e Impedimentos
| ID | Descrição | Impacto | Ação Necessária |
|----|------------|---------|-----------------|
| - | Nenhum impedimento identificado. | - | - |

---

# 5. Riscos e Mitigações
| ID | Risco | Status | Mitigação |
|----|-------|--------|-----------|
| **RISK-08** | Falha de Deploy Silenciosa | **Mitigado** | O pipeline agora usa passos explícitos que falham visivelmente em caso de erro. |

---

# 6. Próximas Ações
- Continuar com a implementação da Timeline (Report 6).
- Validar novos dados integrados no banco de dados lattes.

## 7. Aprovação
| Nome | Cargo | Data |
|------|--------|------|
| Antigravity | Senior Lead | 07/02/2026 |
